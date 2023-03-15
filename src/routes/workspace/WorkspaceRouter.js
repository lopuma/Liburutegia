const { isAuthenticated } = require('../../controller/authController/loginController')
const { getBooks, getBookings, getPartners, getAdmin, redisUsers } = require('../../controller/workSpaceController/workSpaceController')
const routerWorkSpace = require("express").Router();
    routerWorkSpace.get("/books", getBooks);
    routerWorkSpace.get("/bookings", isAuthenticated, getBookings);
    routerWorkSpace.get("/admin", isAuthenticated, redisUsers, getAdmin);
    routerWorkSpace.get("/partners", isAuthenticated, getPartners);
module.exports = routerWorkSpace;