const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/books", async (req, res) => {
  //const books = await connection.query('SELECT * from books')
  const nameUser = req.session.name;
  const logueado = req.session.loggedin;
  const userRol = req.session.rol;
  if (logueado || nameUser) {
    res.render("workspace/dashboard-books", {
      login: true,
      nameUser,
      userRol
    });
  } else {
    login: false, nameUser, userRol;
    res.redirect("/login");
  }
});

router.get("/bookings", async (req, res) => {
  const nameUser = req.session.name;
  const logueado = req.session.loggedin;
  const userRol = req.session.rol;
  if (logueado || nameUser) {
    res.render("workspace/dashboard-bookings", {
      login: true,
      nameUser,
      userRol
    });
  } else {
    login: false, nameUser, userRol;
    res.redirect("/login");
  }
});

router.get("/admin", async (req, res) => {
  const nameUser = req.session.name;
  const logueado = req.session.loggedin;
  const userRol = req.session.rol;
  sql = "SELECT * FROM users";
  if (logueado && userRol) {
    connection.query(sql, function(error, results) {
      if (error) {
        return res.send(error);
      }
      const users = results;
      let existData = ""
      if (users != ""){
        existData = true
      }else{
        existData = false
        req.session = null;
        res.redirect("/");
      }
      console.log("RESULT ==> ", results)
      console.log(existData);
      res.render("workspace/dashboard-admin", {
        login: true,
        nameUser,
        userRol,
        users,
        existData
      });
    });
  } else {
    (login = false), nameUser, userRol;
    res.redirect("/login");
  }
});

router.get("/partners", async (req, res) => {
  const nameUser = req.session.name;
  const logueado = req.session.loggedin;
  const userRol = req.session.rol;
  if (logueado || nameUser) {
    res.render("workspace/dashboard-partners", {
      login: true,
      nameUser,
      userRol
    });
  } else {
    (login = false), nameUser, userRol;
    res.redirect("/login");
  }
});

module.exports = router;
