module.exports = (sequelize, DataTypes) => {
    const ReceitasRestaurantes = sequelize.define("receitas_restaurantes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idreceitas: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idRestaurante: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    ReceitasRestaurantes.associate = function (models) {
        ReceitasRestaurantes.belongsTo(models.receitas, {
            foreignKey: "idreceitas",
        });
        ReceitasRestaurantes.belongsTo(models.restaurantes, {
            foreignKey: "idRestaurante",
        });
    };

    return ReceitasRestaurantes;
};