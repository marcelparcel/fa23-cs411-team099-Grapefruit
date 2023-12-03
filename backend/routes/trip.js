var express = require('express');
var getConn = require('../database');
var trip = express.Router();

/* Get list of trips given stop */
trip.get('/', async function(req, res) {
    if (!req.query.stopid) {
        return res.status(400).json({ message: 'Missing stop' });
    }
    var conn = await getConn;
    var query = 'SELECT DISTINCT Trip.TripId FROM StopsToTrips NATURAL JOIN Trip WHERE StopsToTrips.StopId = ?';
    if (req.query.day !== undefined) {
        if (req.query.day == 0) {
            query = 'SELECT DISTINCT Trip.TripId, Trip.RouteId, Trip.Headsign, StopsToTrips.Time FROM StopsToTrips NATURAL JOIN Trip WHERE StopsToTrips.StopId = ? AND Trip.Sunday = ?';
        } else if (req.query.day == 6) {
            query = 'SELECT DISTINCT Trip.TripId, Trip.RouteId, Trip.Headsign, StopsToTrips.Time FROM StopsToTrips NATURAL JOIN Trip WHERE StopsToTrips.StopId = ? AND Trip.Saturday = ?';
        } else {
            query = 'SELECT DISTINCT Trip.TripId, Trip.RouteId, Trip.Headsign, StopsToTrips.Time FROM StopsToTrips NATURAL JOIN Trip WHERE StopsToTrips.StopId = ? AND Trip.Weekdays = ?';
        }
    }
    try {
        const rows = await conn.query(query, [req.query.stopid, 1]);
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
});

module.exports = trip;