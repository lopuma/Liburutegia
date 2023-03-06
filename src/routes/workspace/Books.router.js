const { isAuthenticated } = require("../../controller/authController/loginController");
const {
    noExistBook,
    redisInfoBook,
    redisCover
} = require("../../controller/apiController/Books.controller.api");
const { getNew, getInfo } = require("../../controller/workSpaceController/Books.controller")
const routerBooks = require("express").Router();
    routerBooks.get("/new", isAuthenticated, getNew);
    routerBooks.get("/info/:idBook", isAuthenticated, redisInfoBook, noExistBook, getInfo);
    //routerBooks.get("/infoCover/:idBook", redisCover, noExistBook, getInfoCover);
module.exports = routerBooks;