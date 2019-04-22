// Setup database
const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort
});

module.exports = pool;