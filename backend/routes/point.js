var express = require('express');
var getConn = require('../database');
var point = express.Router();

/* Get coordinates of trip or stop */
point.get('/', async function(req, res) {
    // select: trip = 0, stop = 1
    if (!req.query.id) {
        return res.status(400).json({ message: 'Missing id' });
    }
    var conn = await getConn;
    var query = 'SELECT * FROM Point WHERE TripId = ? ORDER BY Sequence ASC';
    if (req.query.id2) {
        query = 'SELECT * FROM Stop WHERE StopId = ? OR StopId = ?';
    }
    try {
        const rows = await conn.query(query, [req.query.id, req.query.id2]);
        return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = point;