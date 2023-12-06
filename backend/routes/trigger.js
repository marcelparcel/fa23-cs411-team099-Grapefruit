var express = require('express');
var getConn = require('../database');
var trigger = express.Router();

trigger.post('/', async function(req, res, next) {
    try {
        var conn = await getConn;
        console.log("hi")
        // Perform an update operation that triggers the CheckStopsPicked trigger
        var updateQuery = "UPDATE StopsPicked SET StopId1 = ?, StopId2 = (SELECT StopId1 FROM StopsPicked WHERE Email = ?) WHERE Email = ?";
        //send email of user you would like to update on. 
        // Adjust the query based on your requirements

        const updateResult = await conn.query(updateQuery, [req.body.stopId, req.body.email]); // Assuming you have a stopId in the request body
        console.log('Received data from Postman - stopId:', req.body.stopId, 'email:', req.body.email);
        conn.release();

        return res.json({ success: true, message: 'Update successful.' });
    } catch (err) {
        console.error(err);
        if (conn) {
            conn.release();
        }
        return res.status(500).json({ error: 'An error occurred while performing the update.' });
    }
});

module.exports = trigger;




