const knex = require('knex');
const Knex = require('knex');

const params = {
  client: process.env.DB_CLIENT,
  version: process.env.DB_VERSION,
  connection: {
    host : process.env.DB_URL,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  },
  debug: process.env.DB_DEBUG_ON || false

}

module.exports = Knex(params);
