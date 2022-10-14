const routerReset = require('express').Router();
const { postReset } = require('../../controller/authController/resetController')

// FORGOT-PASSWORD

routerReset.post("/", postReset);

module.exports = routerReset;