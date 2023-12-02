DELIMITER $$
CREATE PROCEDURE Result()
BEGIN
   Declare varHeadsign VARCHAR(255);
   Declare varCountTripId INT;
   Declare varAvgRoutePrice REAL;
   Declare varOptionsClassification VARCHAR(255);
  
   Declare exit_loop BOOLEAN default FALSE;


   Declare tripCur CURSOR FOR(SELECT Trip.Headsign, COUNT(DISTINCT Trip.TripId), AVG(Route.Price)
   AS avgRoutePrice
   FROM  Trip
   JOIN StopsToTrips ON StopsToTrips.TripId = Trip.TripId
   JOIN Stop ON StopsToTrips.StopId = Stop.StopId
   JOIN Route ON Trip.RouteId = Route.RouteId
   GROUP BY Trip.Headsign
   ORDER BY avgRoutePrice ASC);


   Declare Continue Handler FOR Not Found SET exit_loop = TRUE;


   Drop Table IF EXISTS NewTable;


   Create Table NewTable(
   Headsign VARCHAR(255),
   AvgRoutePrice Real,
   CountTripId INT,
   OptionsClassification VARCHAR(255)
 );
   Open tripCur;
       cloop: LOOP
       FETCH tripCur Into varHeadsign, varCountTripId, varAvgRoutePrice;
   IF exit_loop THEN
       Leave cloop;
   END IF;
   IF varCountTripId >= 30 THEN
       SET varOptionsClassification = "Several Options";
   ELSEIF varCountTripId >= 20 THEN
       SET varOptionsClassification = "Decent Amount Options";
   ELSEIF varCountTripId >= 10 THEN
       SET varOptionsClassification = "Limited Options";
   ELSE
       SET varOptionsClassification = "Very Limited Options";


   END IF;
   Insert INTO NewTable Value(varHeadsign, varAvgRoutePrice,  varCountTripId,  varOptionsClassification);
   END LOOP cloop;
   Close tripCur;


   Select OptionsClassification, SUM(CountTripId) as Total_Trip_IDs, AVG(AvgRoutePrice) as AVG_Price, GROUP_CONCAT(Headsign) as Headsigns
   From NewTable
   WHERE Headsign IN (Select Headsign From Trip WHERE ServiceId = "USD")
   Group BY OptionsClassification;
   
END $$
DELIMITER ;
