const routerPartners = require('express').Router();
const { validate, getPartners, getPartner, existPartner, noExistPartner, addPartner, deletePartner, putPartner} = require('../../controller/apiController/partnerController');
const { isAuthenticated } = require('../../controller/authController/loginController');

//SHOW ALL
routerPartners.get("/", getPartners);

//SHOW PARTNER
routerPartners.get("/:id_partner", getPartner);

//ADD
routerPartners.post("/add", isAuthenticated, validate, addPartner);

//DELETE
routerPartners.delete("/delete/:id_partner", isAuthenticated, noExistPartner, deletePartner);

//UPDATE
routerPartners.put("/update/:id_partner", isAuthenticated, noExistPartner, validate, putPartner);

module.exports = routerPartners;