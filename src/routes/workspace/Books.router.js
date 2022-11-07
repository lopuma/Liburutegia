const routerBooks = require("express").Router();

const { isAuthenticated } = require("../../controller/authController/loginController");
const { getNew, getInfo } = require("../../controller/workSpaceController/Books.controller");

routerBooks.get("/new", isAuthenticated, getNew);

routerBooks.get("/info/:idPartner", isAuthenticated, getInfo);

module.exports = routerBooks;
