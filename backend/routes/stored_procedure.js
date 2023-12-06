var express = require('express');
var getConn = require('../database');
var sp = express.Router();

sp.get('/', async function(req, res, next) {
    
    var conn = await getConn;
    var query =  "CALL Result()"
    if (req.query.get) query = "SELECT * FROM NewTable";
    
    try {
        const rows = await conn.query(query); // example query P
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
  });

module.exports = sp;
