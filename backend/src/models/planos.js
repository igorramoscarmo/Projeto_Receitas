module.exports = (sequelize, DataTypes) => {
    const Planos = sequelize.define('planos', {
        idPlano: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipoPlano: {
            type: DataTypes.STRING,
            allowNull: false
        },
        valor: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        prioridade: DataTypes.STRING,
        descricao: DataTypes.TEXT
    }, {});

    Planos.associate = function(models) {
        Planos.hasMany(models.assinaturas_clientes, { foreignKey: 'idPlano', as: 'assinaturas' });
    };

    return Planos;
};
