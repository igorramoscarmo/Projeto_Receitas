/* --------------------------------------------------------------------

    Ficheiro que contém os controladores para associar receitas a restaurantes.

--------------------------------------------------------------------- */
const {
    receitas,
    categorias,
    restaurantes,
    receitas_restaurantes,
    assinaturas_clientes,
} = require("../models");
const { Op } = require("sequelize");

// Função para associar uma receita a restaurantes
exports.associarReceitaRestaurantes = async (req, res) => {
    try {
        const { idReceita } = req.params;

        // Buscar categorias da receita
        const receita = await receitas.findByPk(idReceita, {
            include: [{ model: categorias, through: "receita_categorias" }],
        });

        if (!receita) {
            return res.status(404).json({ mensagem: "Receita não encontrada" });
        }

        const categoriasIds = receita.categorias.map((cat) => cat.idCategorias);

        // Buscar restaurantes com as mesmas categorias
        const restaurantesCompativeis = await restaurantes.findAll({
            include: [
                {
                    model: categorias,
                    through: "rr_categorias",
                    where: { idCategorias: { [Op.in]: categoriasIds } },
                },
                {
                    model: assinaturas_clientes,
                    where: { statusAss: "Ativo" },
                    required: false,
                },
            ],
        });

        // Criar associações
        const associacoes = restaurantesCompativeis.map((rest) => ({
            idreceitas: idReceita,
            idRestaurante: rest.idRestaurante,
        }));

        await receitas_restaurantes.bulkCreate(associacoes, {
            ignoreDuplicates: true,
        });

        res.json({ mensagem: "Associações criadas com sucesso" });
    } catch (erro) {
        console.error("Erro ao associar receita a restaurantes:", erro);
        res.status(500).json({
            mensagem: "Erro ao associar receita a restaurantes",
        });
    }
};
