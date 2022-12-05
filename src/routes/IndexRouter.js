const {
    getIndex
} = require("../controller/indexController/indexController");

// TODO 👌 
const routerIndex = require("express").Router();

    routerIndex.get("/", getIndex);

module.exports = routerIndex;
