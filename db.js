const db = require('pg').Pool;

const pool = new db({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'Pizzaria',
    port: 5432,
})

module.exports = pool;