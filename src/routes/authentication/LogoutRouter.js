const { getLogout } = require('../../controller/authController/logoutController')

const routerLogout = require('express').Router();

    // TODO 👌 
    routerLogout.get("/", getLogout)

module.exports = routerLogout;