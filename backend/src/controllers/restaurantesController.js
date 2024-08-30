/* --------------------------------------------------------------------

    Ficheiro que contém os controladores relacionados com os restaurantes.

--------------------------------------------------------------------- */

// Importa os modelos necessários
const { restaurantes, utilizadores, assinaturas_clientes, planos } = require('../models');
// Importa o Sequelize (não é usado, apagar!)
const { Op } = require('sequelize');

exports.getRestaurantesDestaque = async (req, res) => {
    try {
        // Procura todos os restaurantes com assinaturas ativas pois são os que vão aparecer em destaque
        const restaurantesAtivos = await restaurantes.findAll({
            include: [{
                model: utilizadores,
                include: [{
                    model: assinaturas_clientes,
                    where: {
                        statusAss: 'Ativo'
                    },
                    include: [{
                        model: planos,
                        as: 'planoRelacionado'
                    }]
                }]
            }],
            order: [
                [{ model: utilizadores }, { model: assinaturas_clientes }, { model: planos, as: 'planoRelacionado' }, 'prioridade', 'DESC']
            ]
        });

        // Função para selecionar aleatoriamente 4 restaurantes
        const selecionarRestaurantesAleatorios = (restaurantes, quantidade) => {
            const shuffled = [...restaurantes].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, quantidade);
        };

        // Selecionar 4 restaurantes aleatoriamente, se houver mais de 4
        // Se houver tempo, implementar um algoritmo de seleção mais justo
        const restaurantesSelecionados = restaurantesAtivos.length > 4 
            ? selecionarRestaurantesAleatorios(restaurantesAtivos, 4)
            : restaurantesAtivos;

        // Formatar os dados para enviar ao frontend
        const restaurantesFormatados = restaurantesSelecionados.map(restaurante => ({
            idRestaurante: restaurante.idRestaurante,
            nome: restaurante.nome,
            folder: restaurante.folder,
            website: restaurante.website
        }));

        res.json(restaurantesFormatados);
    } catch (erro) {
        console.error('Erro ao buscar restaurantes em destaque:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar restaurantes em destaque' });
    }
};