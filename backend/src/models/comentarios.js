/* --------------------------------------------------------------------

    Ficheiro que contém o modelo dos comentários.

--------------------------------------------------------------------- */

module.exports = (sequelize, DataTypes) => {
    const Comentarios = sequelize.define('comentarios', {
        idComentarios: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dataComentario: {
            type: DataTypes.DATE,
            allowNull: false
        },
        statusComentario: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        notasAdmin: DataTypes.TEXT,
        idutilizador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idreceitas: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});

    Comentarios.associate = function(models) {
        Comentarios.belongsTo(models.receitas, { foreignKey: 'idreceitas' });
        Comentarios.belongsTo(models.utilizadores, { foreignKey: 'idutilizador' });
    };

    return Comentarios;
};
