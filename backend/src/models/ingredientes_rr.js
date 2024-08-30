/* --------------------------------------------------------------------

    Ficheiro que contém o modelo dos ingredientes das receitas dos restaurantes.

--------------------------------------------------------------------- */
module.exports = (sequelize, DataTypes) => {
    const IngredientesRR = sequelize.define('ingredientes_rr', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idRestaurante: DataTypes.INTEGER,
        quantidade: DataTypes.STRING,
        unidade: DataTypes.STRING,
        idIngrediente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idRecRest: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});

    IngredientesRR.associate = function(models) {
        IngredientesRR.belongsTo(models.ingredientes, { foreignKey: 'idIngrediente' });
        IngredientesRR.belongsTo(models.receitas_restaurantes, { foreignKey: 'idRecRest' });
    };

    return IngredientesRR;
};
