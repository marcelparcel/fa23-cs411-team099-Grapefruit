var express = require('express');
var getConn = require('../database');
var stop = express.Router();

/* Get list of distinct stops */
stop.get('/', async function(req, res) {
    var conn = await getConn;
    var query = 'SELECT DISTINCT * FROM Stop';
    if (req.query.tripid) {
        query = 'SELECT DISTINCT Stop.StopId, Stop.Name, StopsToTrips.Sequence FROM Stop NATURAL JOIN StopsToTrips NATURAL JOIN Trip WHERE Trip.TripId = ? ORDER BY StopsToTrips.Sequence ASC';
    }
    try {
        const rows = await conn.query(query, [req.query.tripid]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});

module.exports = stop;