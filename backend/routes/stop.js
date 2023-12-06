var express = require('express');
var getConn = require('../database');
var stop = express.Router();

/* Get list of distinct stops */
stop.get('/', async function(req, res) {
    var conn = await getConn;
    var query = 'SELECT DISTINCT * FROM Stop';
    if (req.query.tripid) {
        query = 'SELECT DISTINCT Trip.TripId, Stop.StopId, Stop.Name, StopsToTrips.Sequence FROM Stop NATURAL JOIN StopsToTrips NATURAL JOIN Trip WHERE Trip.TripId = ? ORDER BY StopsToTrips.Sequence ASC';
    }
    try {
        const rows = await conn.query(query, [req.query.tripid]);
        return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    } finally {
        if (conn) conn.release();
    }
});

/* Add two stops to StopsPicked */
stop.post('/', async function(req, res) {
    if (!req.body.email || !req.body.stop1 || !req.body.stop2) {
        return res.status(400).json({ message: 'Missing Email, Stop 1, or Stop 2' });
    }
    var conn = await getConn;
    var query = 'INSERT INTO StopsPicked(Email, StopId1, StopId2) VALUES (?, ?, ?)';
    try {
        const rows = await conn.query(query, [req.body.email, req.body.stop1, req.body.stop2]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});

/* Delete from StopsPicked */
stop.delete('/', async function(req, res) {
    if (!req.body.email || !req.body.stop1 || !req.body.stop2) {
        return res.status(400).json({ message: 'Missing Email, Stop 1, or Stop 2' });
    }
    var conn = await getConn;
    var query = 'DELETE FROM StopsPicked WHERE Email = ? AND StopId1 = ? AND StopId2 = ?';
    try {
        const rows = await conn.query(query, [req.body.email, req.body.stop1, req.body.stop2]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});


module.exports = stop;