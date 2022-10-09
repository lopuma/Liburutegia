const routerLogout = require('express').Router();
const { getLogout } = require('../../controller/authController/logoutController')
// LOGOUTH
routerLogout.get("/", getLogout)

module.exports = routerLogout;