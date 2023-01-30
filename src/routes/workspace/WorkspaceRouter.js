const { isAuthenticated } = require('../../controller/authController/loginController')
const { getBooks, getBookings, getPartners, getAdmin } = require('../../controller/workSpaceController/workSpaceController')

// TODO 👌 
const routerWorkSpace = require("express").Router();

    routerWorkSpace.get("/books", isAuthenticated, getBooks);
//routerWorkSpace.get("/books", getBooks);

    routerWorkSpace.get("/bookings", isAuthenticated, getBookings);
//routerWorkSpace.get("/bookings", getBookings);

    //routerWorkSpace.get("/admin", isAuthenticated, getAdmin);
    routerWorkSpace.get("/admin", getAdmin);

    routerWorkSpace.get("/partners", isAuthenticated, getPartners);
//routerWorkSpace.get("/partners", isAuthenticated, getPartners);

module.exports = routerWorkSpace;