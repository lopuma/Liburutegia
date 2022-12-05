const routerPartners = require("express").Router();
const {
    validate,
    getPartners,
    getPartner,
    existPartner,
    noExistPartner,
    addPartner,
    deletePartner,
    putPartner,
    infoPartner
} = require("../../controller/apiController/Partner.controller.api");
const {
    isAuthenticated
} = require("../../controller/authController/loginController");

//TODO SHOW ALL
routerPartners.get("/", getPartners);

//TODO SHOW PARTNER
routerPartners.get("/:idPartner", noExistPartner, getPartner);

routerPartners.post("/", validate, addPartner);

//TODO API INFORMACION PARTNER
routerPartners.get("/info/:idPartner", noExistPartner, infoPartner);

//ADD
routerPartners.post("/add", isAuthenticated, existPartner, addPartner);

//DELETE
routerPartners.get(
    "/delete/:idPartner",
    isAuthenticated,
    noExistPartner,
    deletePartner
);

//UPDATE
routerPartners.post(
    "/update/:idPartner",
    isAuthenticated,
    noExistPartner,
    validate,
    putPartner
);

module.exports = routerPartners;
