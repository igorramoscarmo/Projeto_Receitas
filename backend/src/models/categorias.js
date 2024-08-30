/* --------------------------------------------------------------------

    Ficheiro que contém o modelo das categorias.
--------------------------------------------------------------------- */

module.exports = (sequelize, DataTypes) => {
    const Categorias = sequelize.define('categorias', {
        idCategorias: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});

    Categorias.associate = function(models) {
        Categorias.belongsToMany(models.receitas, { 
            through: 'receita_categorias',
            foreignKey: 'idCategorias',
            otherKey: 'idreceitas'
        });
    };
    return Categorias;
};