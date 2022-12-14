const {
  getFamily
} = require("../../controller/apiController/Familys.controller.api");

const routerFamilys = require("express").Router();
  
  routerFamilys.get("/:dniPartner", getFamily);

module.exports = routerFamilys;
