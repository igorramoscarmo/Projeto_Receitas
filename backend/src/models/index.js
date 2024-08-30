/* --------------------------------------------------------------------

    Ficheiro que contém o código para carregar os modelos da base de dados.

--------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const db = {};


// Carregar os modelos da base de dados
fs.readdirSync(__dirname)
    // Filtrar ficheiros que não são este e que não começam por '.'
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
    })
    // Para cada ficheiro, carregar o modelo
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });
// Associar os modelos
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('Modelos carregados:', Object.keys(db));

module.exports = db;