var mysql = require('mysql2/promise');
var {Connector} = require('@google-cloud/cloud-sql-connector');

const connector = new Connector();

async function createConnection(connector) {
    const clientOpts = await connector.getOptions({
        instanceConnectionName: 'grapefruit-099:us-central1:grapefruit-099',
        ipType: 'PUBLIC',
    });
    const pool = await mysql.createPool({
        ...clientOpts,
        user: 'root',
        password: 'ilovecheese1234',
        database: '411-project',
    });
    const conn = await pool.getConnection();
    return conn;
}

const conn = createConnection(connector);

module.exports = conn;