/* --------------------------------------------------------------------

    Ficheiro que contém o controlador que vai buscar as dicas à base de dados.

--------------------------------------------------------------------- */

// Importa o modelo das dicas
const { dicas } = require('../models');
// Importa o Sequelize
const { Sequelize } = require('sequelize');

// Função que usa o Sequelize para buscar uma dica aleatória à base de dados
exports.getDicaAleatoria = async (req, res) => {
    try {
        // Vai buscar uma dica aleatória à base de dados.
        // A dica é um objeto com o id e o texto da dica.
        // Sequelize.literal -> permite usar funções do SQL diretamente. Neste caso, usamos a função RANDOM() 
        const dicaAleatoria = await dicas.findOne({
        order: Sequelize.literal('RANDOM()'),
        attributes: ['idDica', 'texto']
        });
        
        // Se não existir nenhuma dica, devolve um erro 404
        if (!dicaAleatoria) {
        return res.status(404).json({ mensagem: 'Nenhuma dica encontrada' });
        }

        // Faz o parse da dica para JSON e devolve-a
        res.json(dicaAleatoria);
    } catch (erro) {
        console.error('Erro ao buscar dica aleatória:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar dica aleatória' });
    }
};