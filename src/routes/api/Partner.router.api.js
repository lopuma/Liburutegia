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
} = require("../../controller/apiController/Partners.controller.api");

const {
    isAuthenticated
} = require("../../controller/authController/loginController");

// TODO 👌 
const routerPartners = require("express").Router();

    routerPartners.get("/", getPartners);

    routerPartners.get("/:idPartner", noExistPartner, getPartner);

    routerPartners.get("/info/:idPartner", noExistPartner, infoPartner);

    routerPartners.post("/add/:idPartner", validate, existPartner, noExistPartner, addPartner);

    routerPartners.get(
        "/delete/:idPartner",
        noExistPartner,
        deletePartner
    );

    routerPartners.post(
        "/update/:idPartner",
        noExistPartner,
        validate,
        putPartner
    );

module.exports = routerPartners;
