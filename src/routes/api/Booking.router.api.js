const {
    existBooking,
    noExistBooking,
	getBookings,
	getBooking,
	addBooking,
	cancelBooking,
    redisBookings,
    redisBooking
} = require("../../controller/apiController/Bookings.controller.api");

const {
    noExistBook,
} = require('../../controller/apiController/Books.controller.api');

const {
	isAuthenticated
} = require("../../controller/authController/loginController");


const routerBookings = require("express").Router();
	routerBookings.get("/", isAuthenticated, redisBookings, getBookings);
	routerBookings.get("/:idBooking", isAuthenticated, redisBooking, noExistBooking, getBooking);
    routerBookings.post("/add/:idBook", isAuthenticated, noExistBook, addBooking);
    routerBookings.post("/cancel/:idBooking", isAuthenticated, cancelBooking);
module.exports = routerBookings;