const {
  isAuthenticated
} = require("../../controller/authController/loginController");

const {
  getRegister,
  postRegister
} = require("../../controller/authController/registerController");

// TODO 👌
const routerRegister = require("express").Router();

  //routerRegister.get("/", isAuthenticated, getRegister);
  routerRegister.get("/", getRegister);

  //routerRegister.post("/", isAuthenticated, postRegister);
  routerRegister.post("/", postRegister);

module.exports = routerRegister;
