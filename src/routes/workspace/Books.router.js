const { isAuthenticated } = require("../../controller/authController/loginController");

const {
    noExistBook
} = require("../../controller/apiController/Books.controller.api");

const { getNew, getInfo, getInfoCover } = require("../../controller/workSpaceController/Books.controller");

// TODO 👌 
const routerBooks = require("express").Router();

    routerBooks.get("/new", isAuthenticated, getNew);

    routerBooks.get("/info/:idBook", isAuthenticated, noExistBook, getInfo);
//routerBooks.get("/info/:idBook", noExistBook, getInfo);

    routerBooks.get("/infoCover/:idBook", noExistBook, getInfoCover);

module.exports = routerBooks;