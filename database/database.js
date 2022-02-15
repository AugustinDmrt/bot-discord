const { Sequelize } = require('sequelize')
const  { Sequelize } = require('../config/db.js'); //sequelize instance

module.exports = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: '217.160.186.162',
    dialect: 'mariadb'
});