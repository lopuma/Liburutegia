const {
    existBooking,
    noExistBooking,
	getBookings,
	getBooking,
	addBooking,
	cancelBooking,
} = require("../../controller/apiController/Bookings.controller.api");

const {
    noExistBook,
} = require('../../controller/apiController/Books.controller.api');

const {
	isAuthenticated
} = require("../../controller/authController/loginController");


const routerBookings = require("express").Router();

	routerBookings.get("/", getBookings);

	routerBookings.get("/:idBooking", noExistBooking, getBooking);
    
    //routerBookings.post("/add/:idBook", isAuthenticated, noExistBook, addBooking);
    routerBookings.post("/add/:idBook", noExistBook, addBooking);

    //routerBookings.post("/cancel/:idBooking", isAuthenticated, cancelBooking);
    routerBookings.post("/cancel/:idBook", existBooking, noExistBook, noExistBooking, cancelBooking);

module.exports = routerBookings;