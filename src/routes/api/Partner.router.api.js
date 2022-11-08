const routerPartners = require('express').Router();
const { validate, getPartners, getPartner, existPartner, noExistPartner, addPartner, deletePartner, putPartner, infoPartner} = require('../../controller/apiController/Partner.controller.api');
const { isAuthenticated } = require('../../controller/authController/loginController');

//SHOW ALL
routerPartners.get("/", getPartners);

//SHOW PARTNER
routerPartners.get("/:id_partner", getPartner);

//API INFORMACION PARTNER
routerPartners.get("/info/:idPartner", infoPartner);

//ADD
routerPartners.post("/add", isAuthenticated, validate, addPartner);

//DELETE
routerPartners.get("/delete/:id_partner", isAuthenticated, noExistPartner, deletePartner);

//UPDATE
routerPartners.post("/update/:id_partner", isAuthenticated, noExistPartner, validate, putPartner);

module.exports = routerPartners;