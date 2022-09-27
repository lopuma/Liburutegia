const express = require('express');
const connection = require("../../../database/db");

const routerBookings = express.Router();

routerBookings.get("/", async (req, res) => {
	await connection.query("SELECT * FROM bookings", function(err, results) {
	  if (err) {
		  return res.status(404).send(err);
	  }
    if (results.length === 0){
      return res.status(404).send(`No data found for BOOKINGS`);
    }
	  res.send(JSON.stringify({data:results}));
	});
});

routerBookings.get("/:id_booking", async (req, res) => {
  const id_booking = req.params.id_booking;
  var sql = "SELECT * FROM bookings WHERE id_booking=?"
	await connection.query(sql, [id_booking], function(err, results) {
	  if (err) {
		  return res.status(404).send(err);
	  }
    if (results.length === 0){
      return res.status(404).send(`No data found for BOOKING with ID: ${id_booking}`);
    }
	  res.send(JSON.stringify({data:results}));
	});
});

module.exports = routerBookings;