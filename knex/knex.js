


const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile');
module.exports = require('knex')(config);