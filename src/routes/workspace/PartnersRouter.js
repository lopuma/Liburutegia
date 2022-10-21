const routerParters = require("express").Router();
const { isAuthenticated } = require("../../controller/authController/loginController");
const { getNew, getShow } = require('../../controller/workSpaceController/PartnersController')

routerParters.get("/new", isAuthenticated, getNew );

routerParters.get("/new", getShow );

module.exports = routerParters;