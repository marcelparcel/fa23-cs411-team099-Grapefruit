var express = require('express');
var getConn = require('../database');
var fav = express.Router();

/* Get list of favorite stops */
fav.get('/', async function(req, res) {
    if (!req.query.email) {
        return res.status(400).json({ message: 'Missing email' });
    }
    var conn = await getConn;
    var query = 'SELECT StopId1, StopId2, StopId3 FROM FavoriteStop WHERE email = ?';
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
    if (!req.body.email) {
        return res.status(400).json({ message: 'Missing email' });
    }
    var conn = await getConn;
    // this might need to be update? idk
    var query = 'INSERT INTO FavoriteStop(Email, StopId1, StopId2, StopId3) VALUES (?, ?, ?, ?)';
    try {
        const rows = await conn.query(query, [req.body.email]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});

/* Delete favorite stop */

/*  just yapping:

    this needs to be changed to .put and needs to utilize the trigger so that stops are in order
    with StopId1 being the newest and StopId3 being the oldest. 

    If a user adds another stop after already having 3 favorite stops, replace the oldest stop 
    using the trigger (which should set the new stop to StopId1, moving the older stops to StopId2 and StopId3).

    A user won't be able to remove a stop if they don't have any in the first place.

    If a user is removing a stop (for example StopId2), set it to null (and hopefully the trigger 
    will move the other stops down to stopId2 and/or stopId3 if they exist).
*/  
fav.delete('/', async function(req, res) {
    if (!req.body.email || !req.body.stopid) {
        return res.status(400).json({ message: 'Missing email or Stop' });
    }
    var conn = await getConn;
    var query = 'DELETE FROM FavoriteStop WHERE Email = ? AND StopId = ?';
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

module.exports = fav;