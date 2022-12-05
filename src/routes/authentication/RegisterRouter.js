const {
  isAuthenticated
} = require("../../controller/authController/loginController");

const {
  getRegister,
  postRegister
} = require("../../controller/authController/registerController");

// TODO 👌
const routerRegister = require("express").Router();

  routerRegister.get("/", isAuthenticated, getRegister);

  routerRegister.post("/", isAuthenticated, postRegister);

module.exports = routerRegister;
