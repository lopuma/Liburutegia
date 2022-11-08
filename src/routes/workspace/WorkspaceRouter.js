const routerWorkSpace = require("express").Router();
const { isAuthenticated } = require('../../controller/authController/loginController')
const { getBooks, getBookings, getPartners, getAdmin } = require('../../controller/workSpaceController/workSpaceController')

routerWorkSpace.get("/books", getBooks);

routerWorkSpace.get("/bookings", isAuthenticated, getBookings);

routerWorkSpace.get("/admin", isAuthenticated, getAdmin);

//TODO :OK
routerWorkSpace.get("/partners", isAuthenticated, getPartners);

module.exports = routerWorkSpace;