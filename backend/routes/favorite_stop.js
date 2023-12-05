var express = require('express');
var getConn = require('../database');
var fav = express.Router();

/* Get list of favorite stops */
fav.get('/', async function(req, res) {
    if (!req.query.email) {
        return res.status(400).json({ message: 'Missing email' });
    }
    var conn = await getConn;
    var query = 'SELECT StopId FROM FavoriteStop WHERE email = ?';
    try {
        const rows = await conn.query(query, [req.query.email]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});

/* Add favorite stop */
fav.post('/', async function(req, res) {
    if (!req.body.email || !req.body.stopid) {
        return res.status(400).json({ message: 'Missing email or Stop' });
    }
    var conn = await getConn;
    var query = 'INSERT INTO FavoriteStop(Email, StopId) VALUES (?, ?)';
    try {
        const rows = await conn.query(query, [req.body.email, req.body.stopid]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});

/* Delete favorite stop */
fav.delete('/', async function(req, res) {
    if (!req.query.email || !req.query.stopid) {
        return res.status(400).json({ message: 'Missing email or Stop' });
    }
    var conn = await getConn;
    var query = 'DELETE FROM FavoriteStop WHERE Email = ? AND StopId = ?';
    try {
        const rows = await conn.query(query, [req.query.email, req.query.stopid]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});

module.exports = fav;