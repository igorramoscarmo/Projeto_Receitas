/* --------------------------------------------------------------------

    Ficheiro que contém o modelo das fotos das categorias.
--------------------------------------------------------------------- */
module.exports = (sequelize, DataTypes) => {
    const FotoCategoria = sequelize.define('foto_categoria', {
        idFoto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fotoURL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alt: DataTypes.STRING,
        objetoId: DataTypes.INTEGER
    }, {});

    FotoCategoria.associate = function(models) {
        FotoCategoria.belongsTo(models.restaurantes, { foreignKey: 'objetoId', constraints: false });
        FotoCategoria.belongsTo(models.receitas_restaurantes, { foreignKey: 'objetoId', constraints: false });
        FotoCategoria.belongsTo(models.receitas, { foreignKey: 'objetoId', constraints: false });
    };

    return FotoCategoria;
};
