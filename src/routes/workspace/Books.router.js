const { isAuthenticated } = require("../../controller/authController/loginController");
const {
    noExistBook,
    redisInfoBook,
    redisBooks,
} = require("../../controller/apiController/Books.controller.api");
const { getNew, getInfo, getBooks } = require("../../controller/workSpaceController/Books.controller")
const routerBooks = require("express").Router();
    routerBooks.get("/books", isAuthenticated, redisBooks, getBooks);
    routerBooks.get("/new", isAuthenticated, getNew);
    routerBooks.get("/info/:idBook", isAuthenticated, redisInfoBook, noExistBook, getInfo);
module.exports = routerBooks;