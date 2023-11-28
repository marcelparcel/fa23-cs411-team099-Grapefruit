var express = require('express');
var getConn = require('../database');
var user = express.Router();

/* Logging in user */
user.get('/', async function(req, res, next) {
  if (!req.query.email || !req.query.password) {
    return res.status(400).json({ message: 'Missing email or password.' });
  }
  var conn = await getConn;
  var query = 'SELECT * FROM User WHERE Email = ? AND Password = ?';
  try {
      const rows = await conn.query(query, [req.query.email, req.query.password]); // example query
      conn.release();
      return res.json(rows[0]);
    } catch (err) {
      console.error(err);
      conn.release();
      return res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});


module.exports = user;
