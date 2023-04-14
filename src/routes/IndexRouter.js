const {
    getIndex
} = require("../controller/indexController/indexController");
const routerIndex = require("express").Router();
    routerIndex.get("/", getIndex);
module.exports = routerIndex;
