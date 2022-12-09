const {
  getFamily
} = require("../../controller/apiController/Familys.controller.api");

const routerFamilys = require("express").Router();
  
//TODO FAMILY
  routerFamilys.get("/:dniPartner", getFamily);

module.exports = routerFamilys;
