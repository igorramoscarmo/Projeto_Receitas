/* --------------------------------------------------------------------

    Ficheiro que contém o modelo das dicas.

--------------------------------------------------------------------- */
module.exports = (sequelize, DataTypes) => {
    const Dicas = sequelize.define('dicas', {
        idDica: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        }
        }, {});
    
        return Dicas;
};