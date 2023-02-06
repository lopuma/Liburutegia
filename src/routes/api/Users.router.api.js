const {

    userExists,
    getUser,
    postUser,
    deleteUser

} = require('../../controller/apiController/Users.controller.api');

const {
    isAuthenticated
} = require("../../controller/authController/loginController");


const routerUser = require('express').Router();

    routerUser.get("/:idUser", isAuthenticated, userExists, getUser);

    routerUser.post("/update/:idUser", isAuthenticated, userExists, postUser);

    routerUser.get("/delete/:idUser", isAuthenticated, userExists, deleteUser);

module.exports = routerUser;