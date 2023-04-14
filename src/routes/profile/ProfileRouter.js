const { isAuthenticated } = require('../../controller/authController/loginController');
const { getProfile } = require('../../controller/profileController/profileController');
const routerProfile = require('express').Router();
    routerProfile.get("/", isAuthenticated, getProfile);
module.exports = routerProfile;