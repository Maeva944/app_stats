const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'app_carglass',
    user: 'postgres',
    password: 'NONO042004'
});


module.exports = pool;