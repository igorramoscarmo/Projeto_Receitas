module.exports = (sequelize, DataTypes) => {
    const ReceitaCategorias = sequelize.define('receita_categorias', {
        idreceitas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'receitas',
                key: 'idreceitas'
            }
        },
        idCategorias: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categorias',
                key: 'idCategorias'
            }
        }
    }, {
        tableName: 'receita_categorias'
    });

    ReceitaCategorias.associate = function(models) {
        ReceitaCategorias.belongsTo(models.receitas, { foreignKey: 'idreceitas' });
        ReceitaCategorias.belongsTo(models.categorias, { foreignKey: 'idCategorias' });
    };

    return ReceitaCategorias;
};
