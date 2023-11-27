var express = require('express');
var router = express.Router();
var getConn = require('../database');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var conn = await getConn;  
  try {
      const rows = await conn.query('SELECT * FROM Stop LIMIT 10'); // example query
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
  conn.release();
});

module.exports = router;
