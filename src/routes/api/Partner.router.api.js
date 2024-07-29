const {
    validate,
    getPartners,
    getPartner,
    getPartnerDNI,
    existPartner,
    noExistPartner,
    addPartner,
    deletePartner,
    activeReserve,
    putPartner,
    infoPartner
} = require("../../controller/apiController/Partners.controller.api");

const {
    isAuthenticated
} = require("../../controller/authController/loginController");

// TODO 👌 
const routerPartners = require("express").Router();

    routerPartners.get("/", isAuthenticated, getPartners);

    routerPartners.get("/:idPartner", isAuthenticated, noExistPartner, getPartner);

    routerPartners.get("/dni/:dniPartner", isAuthenticated, getPartnerDNI);

    routerPartners.get("/info/:idPartner", isAuthenticated, noExistPartner, infoPartner);

    routerPartners.post("/add/:idPartner", isAuthenticated, validate, existPartner, noExistPartner, addPartner);

    routerPartners.get(
        "/delete/:idPartner",
        isAuthenticated,
        noExistPartner,
        deletePartner
    );

    routerPartners.get(
        "/activeReserve/:dniPartner",
        isAuthenticated,
        activeReserve
    );

routerPartners.post(
    "/update/:idPartner",
    noExistPartner,
    validate,
    putPartner
);

module.exports = routerPartners;
