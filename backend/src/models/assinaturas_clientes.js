/* --------------------------------------------------------------------

    Ficheiro que contém o modelo das assinaturas dos clientes.

--------------------------------------------------------------------- */

module.exports = (sequelize, DataTypes) => {
    const AssinaturasClientes = sequelize.define('assinaturas_clientes', {
        idAssinatura: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dataInicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        statusAss: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notas: DataTypes.TEXT,
        idutilizador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idRestaurante: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idPlano: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});

    AssinaturasClientes.associate = function(models) {
        AssinaturasClientes.belongsTo(models.utilizadores, { foreignKey: 'idutilizador' });
        AssinaturasClientes.belongsTo(models.planos, { foreignKey: 'idPlano', as: 'planoRelacionado' });
        AssinaturasClientes.belongsTo(models.restaurantes, { foreignKey: 'idRestaurante' });
    };

    return AssinaturasClientes;
};
