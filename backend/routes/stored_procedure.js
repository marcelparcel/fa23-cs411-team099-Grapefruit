var express = require('express');
var getConn = require('../database');
var sp = express.Router();

sp.get('/', async function(req, res, next) {
    
    var conn = await getConn;
    // var query = 'CREATE PROCEDURE Result() BEGIN Declare varHeadsign VARCH (255); Declare varCountTripId INT; Declare varAvgRoutPrice Real; Declare varOptionsClassification VARCHAR(255); Declare exit_loop BOOLEAN default FALSE; Declare tripCur CURSOR FOR(SELECT Trip.Headsign, COUNT(DISTINCT Trip.TripId), AVG(Route.Price) AS avgRoutePrice FROM  Trip JOIN  StopsToTrips ON StopsToTrips.TripId = Trip.TripId JOIN  Stop ON StopsToTrips.StopId = Stop.StopId JOIN  Route ON Trip.RouteId = Route.RouteId GROUP BY Trip.Headsign ORDER BY avgRoutePrice ASC); Declare Continue Handler FOR Not Found SET exit_loop = TRUE; Drop Table IF EXISTS NewTable; Create Table NewTable( Headsign VARCHAR(255), AvgRoutePrice Real, CountTripId INT, OptionsClassification VARCHAR(255)); Open tripCur; cloop: LOOP FETCH tripCur Into varHeadsign, varCountTripId, varAvgRoutePrice Real IF exit_loop THEN Leave cloop; END IF; IF varCountTripId >= 30 THEN SET varOptionsClassification = “Several Options” ELSEIF varCountTripId >= 20 THEN SET varOptionsClassification = “Decent Amount Options" ELSEIF varCountTripId >= 10 THEN SET varOptionsClassification = “ Limited Options” ELSE SET varOptionsClassification = “ Very Limited Options” END IF; Insert INTO NewTable Value(varHeadsign, varAvgRoutePrice,  varCountTripId,  varOptionsClassification) END LOOP cloop Close tripCur; Select Headsign, CountTripId, AvgRoutePrice, OptionsClassification From NewTable END;';
    var query = 'SELECT Trip.Headsign, COUNT(DISTINCT Trip.TripId) AS numTrips , AVG(Route.Price) AS avgRoutePrice FROM Trip JOIN StopsToTrips ON StopsToTrips.TripId = Trip.TripId JOIN Stop ON StopsToTrips.StopId = Stop.StopId JOIN Route ON Trip.RouteId = Route.RouteId GROUP BY Trip.Headsign ORDER BY avgRoutePrice ASC LIMIT 15'
    
    try {
        const rows = await conn.query(query); // example query
        conn.release();
        return res.json(rows[0]);
      } catch (err) {
        console.error(err);
        conn.release();
        return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
  });

module.exports = sp;