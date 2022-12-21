const {
    validate,
    getLogin,
    postLogin,
} = require("../../controller/authController/loginController");

// TODO 👌 
const routerLogin = require('express').Router();

    routerLogin.get("/", getLogin);

    routerLogin.post("/", validate, postLogin);

module.exports = routerLogin;