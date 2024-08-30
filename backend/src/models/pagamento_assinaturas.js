module.exports = (sequelize, DataTypes) => {
    const PagamentoAssinaturas = sequelize.define('pagamento_assinaturas', {
        idPagamento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dataPagamento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        metodoPagamento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idAssinatura: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});

    PagamentoAssinaturas.associate = function(models) {
        PagamentoAssinaturas.belongsTo(models.assinaturas_clientes, { foreignKey: 'idAssinatura' });
    };

    return PagamentoAssinaturas;
};
