const express = require("express");
const router = express.Router();
const connection = require("../../database/db");
const bscryptjs = require("bcryptjs");
const flash = require("connect-flash");
const authController = require('../controller/authController');

// ROUTER LOGIN
router.post("/login", authController.login);
router.get("/login", async (req, res) => {
  const logueado = req.session.loggedin;
  const nameUser = req.session.name;
  const ruta = req.session.ruta;
  if (logueado) {
    login: true;
    nameUser;
    res.status(200).redirect(ruta);
  } else {
    res.status(200).render("../views/forms/login", {
      login: false,
      nameUser: "",
      error_msg: req.flash("error_msg"),
    });
  }
});
// sql = 'SELECT * FROM users WHERE email = ?';
//  connection.query(sql, email, async (error, results, fields) => {
//       if( results.length == 0 || await bscryptjs.compare(passwordHashing, results[0].pass)) {
//          console.log("ERORR")
//          res.send({Error: error})
// req.session.loggedin = false;
// req.session.name = "";
// req.flash('error_msg', "These credentials do not match our records.")
// return res.status(500).json({
//     ok: false,
//     err: error
// },
// res.redirect('/login')
//);
//  }else{
//  console.log("SUCCES")
//   res.send({Success: results[0].email});

//req.session.loggedin = true;
//req.session.name = results[0].firstname;
//req.flash('messages', 'Flash is back!');
//return res.status(500).json({
//     ok: false,
//     err: error
// }, res.redirect('workspace/books'),
// res.end()
// );
//  };

// if (email && pass) {
//         connection.query('SELECT * FROM users WHERE email ?', async (error, results, fields) => {
//         if( results.length == 0 || passwordHashing != results[0].pass ) {
//             req.session.loggedin = false;
//             req.session.name = "";
//             return res.status(500).json({
//                 ok: false,
//                 err: error
//             },
//             res.redirect('/login')
//             );
//             } else {
//                 creamos una var de session y le asignamos true si INICIO SESSION
//                 req.session.loggedin = true;
//                 req.session.name = results[0].firstname;
//                 res.status(200).send({status: 0, message: "Messages available"});                    // res.redirect('../workspace/books');
//                 res.end();
//                 res.redirect('/',)
//         }
//         res.end();
//     });
// } else {
//     res.send('alert("Please enter user and Password!")');
//     res.end();
// }

router.post("/reset-password", (req, res) => {
  let reqData = req.body;
  res.send("Recibido-RESE");
  res.end();
});

// LOG IN
// router.get("/login", async (req, res) => {
//   const logueado = req.session.loggedin;
//   const nameUser = req.session.name;
//   const ruta = req.session.ruta;
//   if (logueado) {
//     login: true;
//     nameUser;
//     res.status(200).redirect(ruta);
//   } else {
//     res.status(200).render("../views/forms/login", {
//       login: false,
//       nameUser: "",
//       error_msg: req.flash("error_msg"),
//     });
//   }
// });
//   res.render('index', { messages: req.flash('info') });

//REGISTER
router.get("/register", (req, res) => {
  const logueado = req.session.loggedin;
  const nameUser = req.session.name;
  const userRol = req.session.rol;
  const error_msg_exist = req.flash("error_msg_exist");
  console.log("error", error_msg_exist);

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

router.post("/register", async (req, res) => {
  const { email, firstname, lastname, rol, pass } = req.body;
  const _ss = 0;
  let passwordHash = await bscryptjs.hash(pass, 8);
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
          firstname,
          lastname,
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

// SIGNUP
// router.get("/signup", renderSignUp);
// router.post("/signup", signUp);

// LOGOUTH
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});



module.exports = router;
