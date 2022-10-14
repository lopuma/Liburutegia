const routerLogin = require('express').Router();
const { validate, getLogin, postLogin } = require('../../controller/authController/loginController');
const { isAuthenticated } = require('../../controller/authController/loginController')

// ROUTER LOGIN
routerLogin.post("/", validate, postLogin);

routerLogin.get("/", getLogin);

module.exports = routerLogin;