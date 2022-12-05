const { isAuthenticated } = require("../../controller/authController/loginController");

const {
    noExistBook
} = require("../../controller/apiController/Book.controller.api");

const { getNew, getInfo } = require("../../controller/workSpaceController/Books.controller");

// TODO 👌 
const routerBooks = require("express").Router();

    routerBooks.get("/new", isAuthenticated, getNew);

    routerBooks.get("/info/:idBook", isAuthenticated, noExistBook, getInfo);

module.exports = routerBooks;