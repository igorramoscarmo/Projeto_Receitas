/* --------------------------------------------------------------------

    Ficheiro que contém os controladores relacionados com as receitas

--------------------------------------------------------------------- */

// Importa os modelos necessários
const { 
    receitas, 
    comentarios, 
    historico_receitas, 
    restaurantes, 
    ingredientes, 
    instrucoes, 
    categorias, 
    receitas_restaurantes,
    assinaturas_clientes } = require('../models');

// Importa o Sequelize e o operador Op
// O operador Op vai ser usado na pesquisa de receitas
const { Sequelize, Op, literal } = require('sequelize');
const sequelize = require('../config/database');

// Obtem os dados para mostrar no carrossel da página inicial
exports.getReceitasCarousel = async (req, res) => {
    try {
        const receitasCarousel = await receitas.findAll({
            where: { 
                ativoCarousel: true,
                arquivada: false
            },
            attributes: [
                'idreceitas',
                'titulo',
                'folder',
                'bannerImage',
                [Sequelize.literal('(SELECT COUNT(*) FROM comentarios WHERE comentarios."idreceitas" = receitas."idreceitas")'), 'numeroComentarios'],
                [Sequelize.literal('(SELECT AVG(avaliacao) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas")'), 'avaliacaoMedia'],
                [Sequelize.literal('(SELECT COUNT(*) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas" AND avaliacao IS NOT NULL)'), 'totalAvaliacoes'],
                [Sequelize.literal('(SELECT MAX("dataComentario") FROM comentarios WHERE comentarios."idreceitas" = receitas."idreceitas")'), 'ultimoComentario']
            ],
            group: ['receitas.idreceitas'],
            raw: true
        });
        
        const receitasFormatadas = receitasCarousel.map(receita => ({
            id: receita.idreceitas,
            titulo: receita.titulo,
            imagemUrl: `/images/receitas/${receita.folder}/${receita.bannerImage}`,
            numeroComentarios: parseInt(receita.numeroComentarios) || 0,
            avaliacaoMedia: parseFloat(receita.avaliacaoMedia) || 0,
            totalAvaliacoes: parseInt(receita.totalAvaliacoes) || 0,
            ultimoComentario: receita.ultimoComentario
        }));
        res.json(receitasFormatadas);
    } catch (erro) {
        console.error('Erro ao buscar receitas para o carrossel:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas para o carrossel' });
    }
};


// Obtem os dados relativos a uma pesquisa no site.
// Pesquisa nas tabelas de receitas, ingredientes, categorias, instruções e restaurantes associados.
exports.pesquisar = async (req, res) => {
    try {
        const { termo } = req.query;
        
        // Verifica se o termo de pesquisa foi fornecido
        if (!termo) {
            return res.status(400).json({ mensagem: 'Termo de pesquisa não fornecido' });
        }

        // Faz a pesquisa nas tabelas de receitas, ingredientes, categorias, instruções e restaurantes associados
        // Na cláusula WHERE, usamos o operador [Op.or] para fazer a pesquisa em vários campos e tabelas
        // Primeiro vamos verificar o título e a descrição da receita e ver e contêm o termo
        // Depois, vamos verificar se a receita tem ingredientes que contêm o termo
        // A seguir, verificamos se a receita tem categorias que contêm o termo
        // Por fim, verificamos se a receita tem instruções que contêm o termo
        // Depois vamos incluir algumas tabelas associadas para mostrar os dados no frontend
        // No final, vamos buscar os atributos que queremos mostrar no frontend e limitar o número de resultados a 10
        const receitasResultados = await receitas.findAll({
            where: {
                arquivada: false,
                [Op.or]: [
                    { titulo: { [Op.iLike]: `%${termo}%` } },
                    { descricao: { [Op.iLike]: `%${termo}%` } },
                    Sequelize.literal(`EXISTS (SELECT 1 FROM receita_ingredientes ri 
                        JOIN ingredientes i ON ri."idIngrediente" = i.id_ingrediente 
                        WHERE ri."idreceitas" = "receitas"."idreceitas" 
                        AND i.nome ILIKE '%${termo}%')`),
                    Sequelize.literal(`EXISTS (SELECT 1 FROM receita_categorias rc 
                        JOIN categorias c ON rc."idCategorias" = c."idCategorias" 
                        WHERE rc."idreceitas" = "receitas"."idreceitas" 
                        AND c.nome ILIKE '%${termo}%')`),
                    Sequelize.literal(`EXISTS (SELECT 1 FROM instrucoes i 
                        WHERE i."idreceitas" = "receitas"."idreceitas" 
                        AND i.descricao ILIKE '%${termo}%')`)
                ]
            },
            include: [
                {
                    model: ingredientes,
                    through: 'receita_ingredientes',
                    attributes: ['nome']
                },
                {
                    model: categorias,
                    through: 'receita_categorias',
                    attributes: ['nome']
                },
                {
                    model: instrucoes,
                    attributes: ['passo', 'descricao']
                },
                {
                    model: receitas_restaurantes,
                    attributes: ['id', 'idRestaurante'],
                    include: [{
                        model: restaurantes,
                        attributes: ['nome']
                    }],
                    limit: 3
                }
            ],
            attributes: ['idreceitas', 'titulo', 'descricao', 'folder', 'createdAt', 
                [Sequelize.literal('(SELECT COUNT(*) FROM comentarios WHERE comentarios."idreceitas" = receitas."idreceitas")'), 'numeroComentarios'],
                [Sequelize.literal('(SELECT AVG(avaliacao) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas")'), 'avaliacaoMedia']
            ],
            limit: 10
        });

        // Faz a pesquisa nas tabelas de restaurantes
        const restaurantesResultados = await restaurantes.findAll({
            where: {
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${termo}%` } },
                    { localizacao: { [Op.iLike]: `%${termo}%` } }
                ]
            },
            attributes: ['idRestaurante', 'nome', 'localizacao', 'folder', 'website'],
            limit: 10
        });

        // Formata os resultados para serem enviados para o frontend
        // Como estes dados vão ser usados em componentes que são reaproveitados, a formação tem que ser coerente em todos os
        // controladores que vão fornecer dados para esses componentes.
        const resultadosFormatados = {
            receitas: receitasResultados.map(receita => ({
                tipo: 'receita',
                id: receita.idreceitas,
                titulo: receita.titulo,
                descricao: receita.descricao,
                imagemUrl: `/images/receitas/${receita.folder}/thumbnail.jpg`,
                numeroComentarios: parseInt(receita.getDataValue('numeroComentarios')) || 0,
                avaliacaoMedia: parseFloat(receita.getDataValue('avaliacaoMedia')) || 0,
                dataPublicacao: receita.createdAt,
                ingredientes: receita.ingredientes.map(ing => ing.nome),
                categorias: receita.categorias.map(cat => cat.nome),
                instrucoes: receita.instrucoes.map(inst => ({
                    passo: inst.passo,
                    descricao: inst.descricao
                })),
                restaurantes: receita.receitas_restaurantes.map(rr => rr.restaurante.nome)
            })),
            restaurantes: restaurantesResultados.map(restaurante => ({
                tipo: 'restaurante',
                id: restaurante.idRestaurante,
                nome: restaurante.nome,
                localizacao: restaurante.localizacao,
                folder: restaurante.folder,
                website: restaurante.website 
            }))
            
        };
        // Devolve os resultados formatados em JSON
        res.json({
            totalReceitas: resultadosFormatados.receitas.length,
            totalRestaurantes: resultadosFormatados.restaurantes.length,
            resultados: [...resultadosFormatados.receitas, ...resultadosFormatados.restaurantes]
        });

    } catch (erro) {
        console.error('Erro ao realizar pesquisa:', erro);
        res.status(500).json({ mensagem: 'Erro ao realizar pesquisa' });
    }
};

// Obtem as receitas mais recentes para mostrar na página inicial
exports.getReceitasRecentes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const orderBy = req.query.orderBy || 'data';
        const offset = (page - 1) * limit;

        let orderClause;
        switch (orderBy) {
            case 'avaliacao':
                orderClause = [[Sequelize.literal('(SELECT AVG(avaliacao) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas")'), 'DESC NULLS LAST']];
                break;
            case 'comentarios':
                orderClause = [[Sequelize.literal('(SELECT COUNT(*) FROM comentarios WHERE comentarios."idreceitas" = receitas."idreceitas")'), 'DESC']];
                break;
            default:
                orderClause = [['createdAt', 'DESC']];
        }

        const receitasRecentes = await receitas.findAll({
            where: { arquivada: false },
            attributes: [
                'idreceitas',
                'titulo',
                'descricao',
                'folder',
                'createdAt',
                [Sequelize.literal('(SELECT COUNT(*) FROM comentarios WHERE comentarios."idreceitas" = receitas."idreceitas")'), 'numeroComentarios'],
                [Sequelize.literal('(SELECT AVG(avaliacao) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas")'), 'avaliacaoMedia']
            ],
            include: [
                {
                    model: categorias,
                    through: 'receita_categorias',
                    attributes: ['nome'],
                    as: 'categorias'
                }
            ],
            order: orderClause,
            limit: limit,
            offset: offset,
        });

        const receitasFormatadas = receitasRecentes.map(receita => ({
            id: receita.idreceitas,
            titulo: receita.titulo,
            descricao: receita.descricao,
            imagemUrl: `/images/receitas/${receita.folder}/thumbnail.jpg`,
            numeroComentarios: parseInt(receita.getDataValue('numeroComentarios')) || 0,
            avaliacaoMedia: parseFloat(receita.getDataValue('avaliacaoMedia')) || 0,
            dataPublicacao: receita.createdAt,
            categorias: receita.categorias.map(categoria => categoria.nome)
        }));
        
        res.json({
            receitas: receitasFormatadas,
            currentPage: page,
            hasMore: receitasFormatadas.length === limit
        });
    } catch (erro) {
        console.error('Erro ao buscar receitas recentes:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas recentes' });
    }
};

// Obtem 4 receitas aleatórias para mostrar no rodapé da página inicial
exports.getReceitasAleatorias = async (req, res) => {
    try {
        // Vai buscar 4 receitas aleatórias à base de dados
        // Para isso, usamos a função RANDOM() do SQL
        const receitasAleatorias = await receitas.findAll({
            where: { arquivada: false },
            order: Sequelize.literal('RANDOM()'),
            limit: 4,
            attributes: ['idreceitas', 'titulo', 'folder']
        });
        
        // Se não existirem receitas, devolve um erro 404
        if (receitasAleatorias.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma receita encontrada' });
        }
        
        // Formata os dados para serem enviados para o frontend
        const receitasFormatadas = receitasAleatorias.map(receita => ({
            id: receita.idreceitas,
            titulo: receita.titulo,
            thumbnailUrl: `/images/receitas/${receita.folder}/thumbnail.jpg`
        }));
    
        res.json(receitasFormatadas);
        } catch (erro) {
        console.error('Erro ao buscar receitas aleatórias:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas aleatórias' });
        }
};

exports.getRestaurantesAssociados = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensagem: 'ID de receita inválido' });
        }

        const restaurantesAssociados = await restaurantes.findAll({
            include: [
                {
                    model: receitas_restaurantes,
                    where: { idreceitas: id },
                    attributes: []
                },
                {
                    model: assinaturas_clientes,
                    attributes: ['statusAss'],
                    required: false
                }
            ],
            attributes: [
                'idRestaurante', 
                'nome',
                'website'
            ]
        });

        const restaurantesFormatados = restaurantesAssociados.map(restaurante => ({
            idRestaurante: restaurante.idRestaurante,
            nome: restaurante.nome,
            website: restaurante.website,
            assinaturaAtiva: restaurante.assinaturas_clientes.some(ass => ass.statusAss === 'Ativo')
        }));

        // Ordenar os restaurantes: primeiro os com assinatura ativa, depois por nome
        restaurantesFormatados.sort((a, b) => {
            if (a.assinaturaAtiva === b.assinaturaAtiva) {
                return a.nome.localeCompare(b.nome);
            }
            return b.assinaturaAtiva ? 1 : -1;
        });

        res.json(restaurantesFormatados);
    } catch (erro) {
        console.error('Erro ao buscar restaurantes associados:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar restaurantes associados' });
    }
};

exports.getReceitaDetalhes = async (req, res) => {
    try {
        const { id } = req.params;
        
        const receita = await receitas.findOne({
            where: { idreceitas: id, arquivada: false },
            include: [
                { 
                    model: ingredientes,
                    through: { attributes: ['quantidade', 'unidade'] }
                },
                { 
                    model: instrucoes,
                    order: [['passo', 'ASC']]
                },
                {
                    model: categorias,
                    through: { attributes: [] }
                }
            ],
            attributes: [
                'idreceitas', 'titulo', 'descricao', 'dificuldade', 'folder', 'bannerImage',
                [Sequelize.literal('(SELECT AVG(avaliacao) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas")'), 'avaliacaoMedia'],
                [Sequelize.literal('(SELECT COUNT(*) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas" AND avaliacao IS NOT NULL)'), 'totalAvaliacoes']
            ]
        });

        if (!receita) {
            return res.status(404).json({ mensagem: 'Receita não encontrada' });
        }

        // Buscar restaurantes associados
        const restaurantesAssociados = await restaurantes.findAll({
            include: [
                {
                    model: receitas_restaurantes,
                    where: { idreceitas: id },
                    attributes: []
                },
                {
                    model: assinaturas_clientes,
                    where: { statusAss: 'Ativo' },
                    required: false
                }
            ],
            attributes: ['idRestaurante', 'nome', 'folder', 'website'],
            limit: 5,
            order: [
                [assinaturas_clientes, 'idPlano', 'DESC'],
                ['nome', 'ASC']
            ]
        });


        const receitaFormatada = {
            id: receita.idreceitas,
            titulo: receita.titulo,
            descricao: receita.descricao,
            dificuldade: receita.dificuldade,
            imagemUrl: `/images/receitas/${receita.folder}/${receita.bannerImage}`,
            avaliacaoMedia: parseFloat(receita.getDataValue('avaliacaoMedia')) || 0,
            totalAvaliacoes: parseInt(receita.getDataValue('totalAvaliacoes')) || 0,
            categorias: receita.categorias.map(cat => cat.nome),
            ingredientes: receita.ingredientes.map(ing => ({
                nome: ing.nome,
                quantidade: ing.receita_ingredientes.quantidade,
                unidade: ing.receita_ingredientes.unidade
            })),
            passos: receita.instrucoes.map(inst => ({
                id: inst.idInstrucoes,
                passo: inst.passo,
                descricao: inst.descricao
            })),
            restaurantes: restaurantesAssociados.map(rest => ({
                id: rest.idRestaurante,
                nome: rest.nome,
                logo: `/images/restaurantes/${rest.folder}/logotipo.png`,
                website: rest.website,
                temAssinatura: rest.assinaturas_clientes.length > 0
            }))
        };

        res.json(receitaFormatada);
    } catch (erro) {
        console.error('Erro ao buscar detalhes da receita:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar detalhes da receita' });
    }
};

exports.toggleFavorito = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ mensagem: 'Utilizador não autenticado' });
        }

        let [historicoReceita, created] = await historico_receitas.findOrCreate({
            where: { idreceitas: id, idutilizador: userId },
            defaults: { favoritos: true }
        });

        if (!created) {
            historicoReceita.favoritos = !historicoReceita.favoritos;
            await historicoReceita.save();
        }

        res.json({ favorito: historicoReceita.favoritos });
    } catch (erro) {
        console.error('Erro ao alternar favorito:', erro);
        res.status(500).json({ mensagem: 'Erro ao alternar favorito' });
    }
};

exports.avaliarReceita = async (req, res) => {
    try {
        const { id } = req.params;
        const { avaliacao } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ mensagem: 'Utilizador não autenticado' });
        }

        let [historicoReceita, created] = await historico_receitas.findOrCreate({
            where: { idreceitas: id, idutilizador: userId },
            defaults: { avaliacao: avaliacao }
        });

        if (!created) {
            historicoReceita.avaliacao = avaliacao;
            await historicoReceita.save();
        }

        // Recalcular a média de avaliações
        const mediaAvaliacao = await historico_receitas.findOne({
            where: { idreceitas: id },
            attributes: [[sequelize.fn('AVG', sequelize.col('avaliacao')), 'mediaAvaliacao']]
        });

        res.json({ avaliacao: avaliacao, mediaAvaliacao: mediaAvaliacao.get('mediaAvaliacao') });
    } catch (erro) {
        console.error('Erro ao avaliar receita:', erro);
        res.status(500).json({ mensagem: 'Erro ao avaliar receita' });
    }
};