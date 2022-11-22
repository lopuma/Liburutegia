const routerReset = require('express').Router();
const { postReset, userExists } = require('../../controller/authController/resetController')

// FORGOT-PASSWORD

routerReset.post("/", userExists, postReset);

module.exports = routerReset;