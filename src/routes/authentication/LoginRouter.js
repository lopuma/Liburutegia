const routerLogin = require('express').Router();
const { getLogin, postLogin } = require('../../controller/authController/loginController');

// ROUTER LOGIN
routerLogin.post("/", postLogin);

routerLogin.get("/", getLogin);

module.exports = routerLogin;