const { isAuthenticated } = require("../../controller/authController/loginController");
const {
    noExistBook,
    redisInfoBook
} = require("../../controller/apiController/Books.controller.api");
const { getNew, getInfo } = require("../../controller/workSpaceController/Books.controller")
const routerBooks = require("express").Router();
    routerBooks.get("/new", isAuthenticated, getNew);
<<<<<<< HEAD
    routerBooks.get("/info/:idBook", redisInfoBook, noExistBook, getInfo);
=======
    routerBooks.get("/info/:idBook", isAuthenticated, redisInfoBook, noExistBook, getInfo);
>>>>>>> a6f191eef55de77ea70f306909d7cf5ff54b04fb
module.exports = routerBooks;