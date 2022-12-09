const { isAuthenticated } = require('../../controller/authController/loginController')

const {
    validate,
    getLogin,
    postLogin,
    userExists
} = require("../../controller/authController/loginController");

// TODO 👌 
const routerLogin = require('express').Router();

    routerLogin.get("/", getLogin);

    routerLogin.post("/", validate, postLogin);

module.exports = routerLogin;