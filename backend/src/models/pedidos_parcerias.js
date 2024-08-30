module.exports = (sequelize, DataTypes) => {
    const PedidosParcerias = sequelize.define('pedidos_parcerias', {
        idPedido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        statusPedido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idutilizador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idRestaurante: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});

    PedidosParcerias.associate = function(models) {
        PedidosParcerias.belongsTo(models.utilizadores, { foreignKey: 'idutilizador' });
        PedidosParcerias.belongsTo(models.restaurantes, { foreignKey: 'idRestaurante' });
    };

    return PedidosParcerias;
};
