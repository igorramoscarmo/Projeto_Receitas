/* --------------------------------------------------------------------

    Ficheiro que contém o mdoelo do histórico das receitas.
--------------------------------------------------------------------- */
module.exports = (sequelize, DataTypes) => {
    const HistoricoReceitas = sequelize.define(
        "historico_receitas",
        {
            idHistorico: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            idreceitas: {
                type: DataTypes.INTEGER,
                references: {
                    model: "receitas",
                    key: "idreceitas",
                },
            },
            avaliacao: DataTypes.FLOAT,
            concluido: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            instrucaoAtual: DataTypes.INTEGER,
            idreceitas: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            idutilizador: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            favoritos: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {}
    );

    HistoricoReceitas.associate = function (models) {
        HistoricoReceitas.belongsTo(models.receitas, {
            foreignKey: "idreceitas",
        });
        HistoricoReceitas.belongsTo(models.utilizadores, {
            foreignKey: "idutilizador",
        });
    };

    return HistoricoReceitas;
};
