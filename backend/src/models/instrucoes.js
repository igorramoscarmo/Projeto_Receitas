module.exports = (sequelize, DataTypes) => {
    const Instrucoes = sequelize.define('instrucoes', {
        idInstrucoes: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idreceitas: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        passo: DataTypes.INTEGER,
        descricao: DataTypes.TEXT
    }, {});

    Instrucoes.associate = function(models) {
        Instrucoes.belongsTo(models.receitas, { foreignKey: 'idreceitas' });
    };

    return Instrucoes;
};
