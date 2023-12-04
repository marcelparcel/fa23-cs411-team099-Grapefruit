var express = require('express');
var getConn = require('../database');
var user = express.Router();

/* Logging in user */
user.get('/', async function(req, res) {
  if (!req.query.email || !req.query.password) {
    return res.status(400).json({ message: 'Missing email.' });
  }
  var conn = await getConn;
  var query = 'SELECT * FROM User WHERE Email = ? AND Password = ?';
  try {
      const rows = await conn.query(query, [req.query.email, req.query.password]);
      conn.release();
      return res.json(rows[0]);
    } catch (err) {
      console.error(err);
      conn.release();
      return res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});

/* Creating user */
user.post('/', async function(req, res) {
  console.log(req.body);
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(400).json({ message: 'Missing information.' });
  }
  var conn = await getConn;
  var query = 'INSERT INTO User (Email, Password, Name) VALUES (?, ?, ?)';
  try {
      const rows = await conn.query(query, [req.body.email, req.body.password, req.body.name]);
      conn.release();
      return res.json(rows[0]);
    } catch (err) {
      console.error(err);
      conn.release();
      return res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});

/* Updating user */
user.put('/', async function(req, res) {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(400).json({ message: 'Missing information.' });
  }
  var conn = await getConn;
  var query = 'UPDATE User SET Password = ?, Name = ? WHERE Email = ?';
  try {
      const rows = await conn.query(query, [req.body.password, req.body.name, req.body.email]);
      conn.release();
      return res.json(rows[0]);
    } catch (err) {
      console.error(err);
      conn.release();
      return res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});

/* Deleting user */
user.delete('/', async function(req, res) {
  if (!req.query.email || !req.query.password) {
    return res.status(400).json({ message: 'Missing email.' });
  }
  var conn = await getConn;
  var query = 'DELETE FROM User WHERE Email = ? AND Password = ?';
  try {
      const rows = await conn.query(query, [req.query.email, req.query.password]);
      conn.release();
      return res.json(rows[0]);
    } catch (err) {
      console.error(err);
      conn.release();
      return res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});


module.exports = user;
