module.exports = (sequelize, DataTypes) => {
    const TipoUtilizador = sequelize.define('tipo_utilizador', {
        idTipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['administrador', 'user']]
            }
        }
    }, {});

    TipoUtilizador.associate = function(models) {
        TipoUtilizador.hasMany(models.utilizadores, { foreignKey: 'idTipo' });
    };

    return TipoUtilizador;
};
