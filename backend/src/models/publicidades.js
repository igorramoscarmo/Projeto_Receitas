module.exports = (sequelize, DataTypes) => {
    const Publicidades = sequelize.define('publicidades', {
        idPublicidade: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descricao: DataTypes.STRING,
        idRestaurante: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});

    Publicidades.associate = function(models) {
        Publicidades.belongsTo(models.restaurantes, { foreignKey: 'idRestaurante' });
    };

    return Publicidades;
};
