const {
    userExists,
    getUser,
    postUser,
    deleteUser
} = require('../../controller/apiController/Users.controller.api');
const {
    isAuthenticated
} = require("../../controller/authController/loginController");
const { redisUsers, redisUser } = require('../../controller/workSpaceController/workSpaceController');
const routerUser = require('express').Router();
    routerUser.get("/:idUser", isAuthenticated, redisUser, userExists, getUser);
    routerUser.post("/update/:idUser", isAuthenticated, userExists, postUser);
    routerUser.get("/delete/:idUser", isAuthenticated, userExists, deleteUser);
module.exports = routerUser;