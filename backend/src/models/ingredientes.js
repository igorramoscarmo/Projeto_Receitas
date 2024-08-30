module.exports = (sequelize, DataTypes) => {
    const Ingredientes = sequelize.define('ingredientes', {
        id_ingrediente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING
        }
        }, {
        tableName: 'ingredientes',
        timestamps: false
        });

        Ingredientes.associate = function(models) {
            Ingredientes.belongsToMany(models.receitas, {
                through: 'receita_ingredientes',
                foreignKey: 'idIngrediente',
                otherKey: 'idreceitas'
            });
        };
    

    return Ingredientes;
};
