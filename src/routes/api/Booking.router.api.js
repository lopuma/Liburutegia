const {
	validate,
	getBookings,
	getBooking,
	existBooking,
	noExistBooking,
	addBooking,
	deleteBooking,
	putBooking,
	infoBooking
} = require("../../controller/apiController/Bookings.controller.api");
const {
	isAuthenticated
} = require("../../controller/authController/loginController");


const routerBookings = require("express").Router();

	routerBookings.get("/", getBookings);

	routerBookings.get("/:id_booking", async (req, res) => {
		const id_booking = req.params.id_booking;
		var sql = "SELECT * FROM bookings WHERE id_booking=?"
		await connection.query(sql, [id_booking], function (err, results) {
			if (err) {
				return res.status(404).send(err);
			}
			if (results.length === 0) {
				return res.status(404).send(`No data found for BOOKING with ID: ${id_booking}`);
			}
			res.send(JSON.stringify({ data: results }));
		});
	});

module.exports = routerBookings;