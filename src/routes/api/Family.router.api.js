const routerFamilys = require("express").Router();
const {
  getFamily
} = require("../../controller/apiController/Family.controller.api");

//TODO FAMILY
routerFamilys.get("/:dniPartner", getFamily);

module.exports = routerFamilys;
