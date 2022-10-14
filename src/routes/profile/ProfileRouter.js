const routerProfile = require('express').Router();
const { isAuthenticated } = require('../../controller/authController/loginController');
const { getProfile } = require('../../controller/profileController/profileController');

routerProfile.get('/', isAuthenticated, getProfile);

module.exports = routerProfile;
