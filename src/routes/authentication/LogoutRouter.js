const { getLogout } = require('../../controller/authController/logoutController')
const routerLogout = require('express').Router();
    routerLogout.get("/", getLogout)
module.exports = routerLogout;