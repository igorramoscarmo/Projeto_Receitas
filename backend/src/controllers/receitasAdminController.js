/* --------------------------------------------------------------------

    Ficheiro que contém os controladores para a gestão de receitas.

--------------------------------------------------------------------- */

const { receitas, comentarios, historico_receitas, receita_categorias, receita_ingredientes, instrucoes, categorias, ingredientes } = require('../models');
const { Sequelize, Op } = require('sequelize');

// Função para buscar os ingredientes e os passos de uma receita através do ID
exports.getIngredientesEPassos = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ mensagem: 'ID da receita não fornecido' });
    }
    try {
        const receita = await receitas.findByPk(id, {
            include: [
                {
                    model: ingredientes,
                    through: { attributes: ['quantidade', 'unidade'] }
                },
                { model: instrucoes, order: [['passo', 'ASC']] }
            ]
        });

        if (!receita) {
            return res.status(404).json({ mensagem: 'Receita não encontrada' });
        }

        res.json({
            ingredientes: receita.ingredientes,
            passos: receita.instrucoes
        });
    } catch (erro) {
        console.error('Erro ao buscar ingredientes e passos:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar ingredientes e passos' });
    }
};

// Função para buscar os detalhes de uma receita através do ID
exports.atualizarIngredientes = async (req, res) => {
    const { id } = req.params;
    const { ingredientes } = req.body;
    try {
        // Remover ingredientes existentes
        await receita_ingredientes.destroy({ where: { idreceitas: id } });
        
        // Adicionar ou atualizar ingredientes
        for (const ing of ingredientes) {
            if (ing.novo) {
                // Criar novo ingrediente se não existir
                const [novoIngrediente] = await ingredientes.findOrCreate({
                    where: { nome: ing.nome },
                    defaults: { nome: ing.nome }
                });
                ing.id_ingrediente = novoIngrediente.id_ingrediente;
            }
            
            await receita_ingredientes.create({
                idreceitas: id,
                idIngrediente: ing.id_ingrediente,
                quantidade: ing.quantidade,
                unidade: ing.unidade
            });
        }

        res.json({ mensagem: 'Ingredientes atualizados com sucesso' });
    } catch (erro) {
        console.error('Erro ao atualizar ingredientes:', erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar ingredientes' });
    }
};


// Função para atualizar os passos de uma receita através do ID
exports.atualizarPassos = async (req, res) => {
    const { id } = req.params;
    const { passos } = req.body;
    try {
        // Remover passos existentes
        await instrucoes.destroy({ where: { idreceitas: id } });
        
        // Adicionar novos passos
        await Promise.all(passos.map((passo, index) => 
            instrucoes.create({
                idreceitas: id,
                passo: index + 1,
                descricao: passo.descricao
            })
        ));

        res.json({ mensagem: 'Passos atualizados com sucesso' });
    } catch (erro) {
        console.error('Erro ao atualizar passos:', erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar passos' });
    }
};

// Função que remove uma receita
// Esta função vai verificar se a receita tem associações com outras tabelas
// Se tiver, a receita é arquivada, caso contrário é removida
// Ao ser arquivada, a receita deixa de ser visível na listagem de receitas e em todo o site
exports.apagarOuArquivarReceita = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar se a receita tem associações
        const [comentariosCount, historicoCount, categoriasCount, ingredientesCount, instrucoesCount] = await Promise.all([
            comentarios.count({ where: { idreceitas: id } }),
            historico_receitas.count({ where: { idreceitas: id } }),
            receita_categorias.count({ where: { idreceitas: id } }),
            receita_ingredientes.count({ where: { idreceitas: id } }),
            instrucoes.count({ where: { idreceitas: id } })
        ]);

        const temAssociacoes = comentariosCount > 0 || historicoCount > 0 || categoriasCount > 0 || ingredientesCount > 0 || instrucoesCount > 0;

        if (temAssociacoes) {
            // Arquivar a receita
            await receitas.update({ arquivada: true }, { where: { idreceitas: id } });
            res.json({ mensagem: 'Receita arquivada com sucesso' });
        } else {
            // Remover a receita
            const receitaDeletada = await receitas.destroy({ where: { idreceitas: id } });
            if (receitaDeletada) {
                res.json({ mensagem: 'Receita removida com sucesso' });
            } else {
                res.status(404).json({ mensagem: 'Receita não encontrada' });
            }
        }
    } catch (erro) {
        console.error('Erro ao apagar ou arquivar receita:', erro);
        res.status(500).json({ mensagem: 'Erro ao apagar ou arquivar receita', erro: erro.message });
    }
};

// Função para listar todas as receitas
exports.listarReceitas = async (req, res) => {
    try {
        const receitasListadas = await receitas.findAll({
            where: {
                arquivada: false 
            },
            include: [
                { 
                    model: categorias, 
                    through: { attributes: [] } 
                }
            ],
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) FROM comentarios WHERE comentarios."idreceitas" = receitas."idreceitas")'), 'numeroComentarios'],
                    [Sequelize.literal('(SELECT COUNT(*) FROM historico_receitas WHERE historico_receitas."idreceitas" = receitas."idreceitas" AND historico_receitas.favoritos = true)'), 'numeroFavoritos']
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(receitasListadas);
    } catch (erro) {
        console.error('Erro ao listar receitas:', erro);
        res.status(500).json({ mensagem: 'Erro ao listar receitas' });
    }
};

// Função para atualizar uma receita
exports.atualizarReceita = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, dificuldade, folder, bannerImage, categorias: novasCategorias } = req.body;

    try {
        const receitaExistente = await receitas.findByPk(id);
        if (!receitaExistente) {
            return res.status(404).json({ mensagem: 'Receita não encontrada' });
        }

        await receitaExistente.update({ 
            titulo, 
            descricao, 
            dificuldade, 
            folder, 
            bannerImage 
        });

        // Atualizar categorias
        if (novasCategorias && Array.isArray(novasCategorias)) {
            await receita_categorias.destroy({ where: { idreceitas: id } });
            
            const categoriasParaAdicionar = novasCategorias.map(categoria => ({
                idreceitas: id,
                idCategorias: typeof categoria === 'object' ? categoria.idCategorias : categoria
            }));

            await receita_categorias.bulkCreate(categoriasParaAdicionar);
        }

        const receitaAtualizada = await receitas.findByPk(id, {
            include: [{ model: categorias, through: { attributes: [] } }]
        });

        res.json(receitaAtualizada);
    } catch (erro) {
        console.error('Erro ao atualizar receita:', erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar receita', erro: erro.message });
    }
};

// Função que define uma receita como ativa ou inativa no carrossel
exports.toggleAtivoCarousel = async (req, res) => {
    const { id } = req.params;
    try {
        const receita = await receitas.findByPk(id);
        if (!receita) {
            return res.status(404).json({ mensagem: 'Receita não encontrada' });
        }
        receita.ativoCarousel = !receita.ativoCarousel;
        await receita.save();
        res.json({ mensagem: `Receita ${receita.ativoCarousel ? 'adicionada ao' : 'removida do'} carrossel` });
    } catch (erro) {
        console.error('Erro ao alterar status no carrossel:', erro);
        res.status(500).json({ mensagem: 'Erro ao alterar status no carrossel' });
    }
};

// Função para apagar uma receita através do ID
exports.apagarReceita = async (req, res) => {
    const { id } = req.params;
    try {
        const receitaDeletada = await receitas.destroy({ where: { idreceitas: id } });
        if (receitaDeletada) {
            res.json({ mensagem: 'Receita apagada com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Receita não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao apagar receita:', erro);
        res.status(500).json({ mensagem: 'Erro ao apagar receita' });
    }
};

// Função para criar uma nova receita
exports.criarReceita = async (req, res) => {
    try {
        const { titulo, descricao, dificuldade, folder, bannerImage, categorias, ingredientes, passos } = req.body;

        // Criar a receita
        const novaReceita = await receitas.create({
            titulo,
            descricao,
            dificuldade,
            folder,
            bannerImage,
            visitas: 0,
            arquivada: false
        }, {
        });

        // Associar categorias
        if (categorias && categorias.length > 0) {
            await receita_categorias.bulkCreate(
                categorias.map(catId => ({ idreceitas: novaReceita.idreceitas, idCategorias: catId }))
            );
        }

        // Adicionar ingredientes
        if (ingredientes && ingredientes.length > 0) {
            for (let ing of ingredientes) {
                const [ingrediente] = await ingredientes.findOrCreate({
                    where: { nome: ing.nome },
                    defaults: { nome: ing.nome }
                });
                await receita_ingredientes.create({
                    idreceitas: novaReceita.idreceitas,
                    idIngrediente: ingrediente.id_ingrediente,
                    quantidade: ing.quantidade,
                    unidade: ing.unidade
                });
            }
        }

        // Adicionar passos
        if (passos && passos.length > 0) {
            await instrucoes.bulkCreate(
                passos.map((passo, index) => ({
                    idreceitas: novaReceita.idreceitas,
                    passo: index + 1,
                    descricao: passo.descricao
                }))
            );
        }

        // Criar pasta para imagens
        const fs = require('fs');
        const path = require('path');
        const dir = path.join(__dirname, '..', '..', 'public', 'images', 'receitas', folder);
        
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        res.status(201).json({ message: 'Receita criada com sucesso', receitaId: novaReceita.idreceitas });
    } catch (erro) {
        console.error('Erro ao criar receita:', erro);
        res.status(500).json({ message: 'Erro ao criar receita', erro: erro.message });
    }
};