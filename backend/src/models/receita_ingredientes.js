module.exports = (sequelize, DataTypes) => {
    const ReceitaIngredientes = sequelize.define('receita_ingredientes', {
        idRecIng: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantidade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        unidade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idIngrediente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idreceitas: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});

    ReceitaIngredientes.associate = function(models) {
        ReceitaIngredientes.belongsTo(models.ingredientes, { foreignKey: 'idIngrediente' });
        ReceitaIngredientes.belongsTo(models.receitas, { foreignKey: 'idreceitas' });
    };

    return ReceitaIngredientes;
};
