module.exports = (sequelize, DataTypes) => {
    const RestauranteCategorias = sequelize.define("restaurante_categorias", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idCategorias: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categorias",
                key: "idCategorias",
            },
        },
        idRestaurante: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "restaurantes",
                key: "idRestaurante",
            },
        },
    });
    
    RestauranteCategorias.associate = function (models) {
        RestauranteCategorias.belongsTo(models.categorias, {
            foreignKey: "idCategorias",
        });
    };
    
        return RestauranteCategorias;
    };