const { postReset, userExists } = require('../../controller/authController/resetController')
const routerReset = require('express').Router();
    routerReset.post("/", userExists, postReset);
module.exports = routerReset;