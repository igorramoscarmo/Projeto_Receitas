/* --------------------------------------------------------------------

    Ficheiro que contém os controladores para as categorias.

--------------------------------------------------------------------- */

const { categorias, restaurante_categorias, receita_categorias } = require('../models');

// Função para listar todas as categorias
exports.listarCategorias = async (req, res) => {
    try {
        const todasCategorias = await categorias.findAll();
        res.json(todasCategorias);
    } catch (erro) {
        console.error('Erro ao listar categorias:', erro);
        res.status(500).json({ mensagem: 'Erro ao listar categorias' });
    }
};

// Função para adicionar uma nova categoria
exports.adicionarCategoria = async (req, res) => {
    const { nome } = req.body;
    try {
        const novaCategoria = await categorias.create({ nome });
        res.status(201).json(novaCategoria);
    } catch (erro) {
        console.error('Erro ao adicionar categoria:', erro);
        res.status(500).json({ mensagem: 'Erro ao adicionar categoria' });
    }
};

// Função para editar uma categoria
exports.removerCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar se a categoria está em uso
        const emUsoEmRestaurantes = await restaurante_categorias.findOne({ where: { idCategorias: id } });
        const emUsoEmReceitas = await receita_categorias.findOne({ where: { idCategorias: id } });

        if (emUsoEmRestaurantes || emUsoEmReceitas) {
            return res.status(400).json({ mensagem: 'Não é possível remover esta categoria pois está em uso.' });
        }

        const categoriaDeletada = await categorias.destroy({ where: { idCategorias: id } });
        if (categoriaDeletada) {
            res.json({ mensagem: 'Categoria removida com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Categoria não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao remover categoria:', erro);
        res.status(500).json({ mensagem: 'Erro ao remover categoria' });
    }
};