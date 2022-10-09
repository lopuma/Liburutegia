const routerPartners = require('express').Router();
const {getPartners, getPartner, existPartner, noExistPartner, addPartner, deletePartner, duplicatePartner, putPartner} = require('../../controller/apiController/partnerController');
//SHOW ALL
routerPartners.get("/", getPartners);

//SHOW PARTNER
routerPartners.get("/:id_partner", getPartner);

//ADD
routerPartners.post("/add", existPartner, addPartner);

//DELETE
routerPartners.delete("/delete/:id_partner", noExistPartner, deletePartner);

//UPDATE
routerPartners.put("/update/:id_partner",duplicatePartner, noExistPartner, putPartner);

module.exports = routerPartners;