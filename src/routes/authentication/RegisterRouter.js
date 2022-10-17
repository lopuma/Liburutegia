const routerRegister = require('express').Router();
const connection = require("../../../database/db");
//const { postReset } = require('../../controller/authController/resetController')
const bscryptjs = require("bcryptjs");

routerRegister.get("/", async (req, res) => {
    const logueado = req.session.loggedin;
    const nameUser = req.session.name;
    const userRol = req.session.rol;
    const error_msg_exist = req.flash("error_msg_exist");
  
    if (logueado && userRol) {
      res.render("../views/forms/register", {
        login: true,
        nameUser,
        userRol,
        error_msg_exist
      });
    } else {
      login = true, nameUser, userRol;
      return res.redirect('/');
    }
  });
  
  routerRegister.post("/", async (req, res) => {
  const { email, username, fullname, rol, newPass } = req.body;
  const _ss = 0;
  let passwordHash = await bscryptjs.hash(newPass, 8);
  sqlUser = "SELECT * FROM users WHERE email = ?";
  connection.query(sqlUser, [email], async (error, resul) => {
    if (error) {
      return res.status(400).send({ error_msg: error });
    }
    if (resul.length == 0) {
      sqlInsert = "INSERT INTO users SET ?";
      connection.query(
        sqlInsert,
        {
          email,
          username,
          fullname,
          rol,
          pass: passwordHash,
          _ss
        },
        async (error, results) => {
          if (error) {
            return res.status(400).send({ error_msg: error });
          }
          respuesta = {
            error: false,
            cod: 200,
            success_msg: "user created",
            data: results
          };
          return res.send(respuesta, res.redirect("workspace/admin"));
          // res.status(200).send({
          //   success_msg: "User creado con existo",
          //   data:results
          // },res.redirect("workspace/admin"),res.end()
          // );
        }
      );
    } else {
      req.flash("error_msg_exist", "Email already exists.");
      res.status(304).send(
        {
          error_msg_exist: "Email already exists."
        },
        res.redirect("/register")
      );
    }
  });
});

module.exports = routerRegister;