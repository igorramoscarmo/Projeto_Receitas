module.exports = (sequelize, DataTypes) => {
    const Restaurantes = sequelize.define('restaurantes', {
        idRestaurante: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        localizacao: DataTypes.STRING,
        contacto: DataTypes.STRING,
        idutilizador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        folder: {
            type: DataTypes.STRING,
            allowNull: false
        },
        website: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
        
    }, {});

    Restaurantes.associate = function(models) {
        Restaurantes.belongsTo(models.utilizadores, { foreignKey: 'idutilizador' });
        Restaurantes.hasMany(models.receitas_restaurantes, { foreignKey: 'idRestaurante' });
        Restaurantes.hasMany(models.assinaturas_clientes, { foreignKey: 'idRestaurante' });
        Restaurantes.hasMany(models.restaurante_categorias, { foreignKey: 'idRestaurante' });
    };

    return Restaurantes;
};
