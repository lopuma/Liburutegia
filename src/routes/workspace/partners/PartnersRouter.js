const routerParters = require("express").Router();
//const { isAuthenticated } = require('../../controller/authController/loginController')
const { getNew, getShow, getDelete, getUpdate } = require('../../../controller/workSpaceController/PartnersController')

routerParters.get("/new", getNew );

routerParters.get("/new", getShow );

routerParters.get("/new", getDelete );

routerParters.get("/new", getUpdate );

module.exports = routerParters;