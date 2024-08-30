/* --------------------------------------------------------------------

    Ficheiro que contém a configuração da base de dados.

--------------------------------------------------------------------- */

// Importa o Sequelize
const { Sequelize } = require('sequelize');

// Cria uma instância do Sequelize com as credenciais da base de dados
const sequelize = new Sequelize('PapaEats', 'postgres', '311091', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

// Exporta a instância do Sequelize para ser usada noutros ficheiros
module.exports = sequelize;
