const routerParters = require("express").Router();

const { isAuthenticated } = require("../../controller/authController/loginController");
const { getNew, getInfo } = require('../../controller/workSpaceController/Partners.controller')

routerParters.get("/new", isAuthenticated, getNew);

routerParters.get("/info/:idPartner", isAuthenticated, getInfo);

module.exports = routerParters;


