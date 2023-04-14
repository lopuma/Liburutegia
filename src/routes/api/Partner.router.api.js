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

    routerPartners.get("/", isAuthenticated, getPartners);

    routerPartners.get("/:idPartner", isAuthenticated, noExistPartner, getPartner);

    routerPartners.get("/info/:idPartner", isAuthenticated, noExistPartner, infoPartner);

    routerPartners.post("/add/:idPartner", isAuthenticated, validate, existPartner, noExistPartner, addPartner);

    routerPartners.get(
        "/delete/:idPartner",
        isAuthenticated,
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
