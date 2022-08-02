const { text } = require("express");
const express = require("express");
const { data } = require("jquery");
const router = express.Router();
const connection = require("../../database/db");
const bodyParser = require("body-parser");
const bscryptjs = require("bcryptjs");
const flash = require("connect-flash");

router.post("/auth", async (req, res) => {
  const logueado = req.session.loggedin;
  const nameUser = req.session.name;
  if (logueado) {
    res.redirect("workspace/books");
  } else {
    let body = req.body;
    console.log(body);
    if (body) {
      //let reqDataValue = JSON.parse(JSON.stringify(body));
      email = body.email;
      pass = body.password;
    }
    let passwordHashing = await bscryptjs.hash(pass, 8);
    console.log(passwordHashing);
    if (email && pass) {
      sql = "SELECT * FROM users WHERE email = ?";
      connection.query(sql, [email], async (error, results) => {
        if (
          results.length == 0 ||
          !await bscryptjs.compare(pass, results[0].pass)
        ) {
          console.log("error");
          req.flash("error_msg", "These credentials do not match our records.");
          res.send(
            {
              Error: error
            },
            res.redirect("/login")
          );
        } else {
          req.session.loggedin = true;
          req.session.name = results[0].firtname;
          console.log("success");
          res.render("../views/forms/login", {
            Success: results[0].email,
            alert: true,
            alertTitle: "Conexion Success",
            alertMessage: "!Login Success",
            alertIcon: "success",
            timer: 2500,
            ruta: ""
          });
        }
      });
    }
  }

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
  //req.session.name = results[0].firtname;
  //req.flash('messages', 'Flash is back!');
  //return res.status(500).json({
  //     ok: false,
  //     err: error
  // }, res.redirect('workspace/books'),
  // res.end()
  // );
  //  };
});

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
//                 req.session.name = results[0].firtname;
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
router.get("/login", async (req, res) => {
  const logueado = req.session.loggedin;
  const nameUser = req.session.name;
  if (logueado) {
    res.render("workspace/dashboard-books", {
      login: true,
      nameUser
    });
  } else {
    res.status(200);
    res.render("../views/forms/login", {
      login: false,
      nameUser: "",
      error_msg: req.flash("error_msg")
    });
  }
});
//   res.render('index', { messages: req.flash('info') });

//REGISTER
router.get("/register", (req, res) => {
  const logueado = req.session.loggedin;
  const nameUser = req.session.name;
  if (logueado) {
    res.render("workspace/dashboard-books", {
      login: true,
      nameUser
    });
  } else {
    res.render("../views/forms/register", {
      login: false,
      nameUser: ""
    });
  }
});

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const firtname = req.body.firtname;
  const lastname = req.body.lastname;
  const rol = req.body.rol;
  const pass = req.body.pass;
  const _ss = 0;
  console.log("REGISTRE : >>>> ", pass);
  let passwordHash = await bscryptjs.hash(pass, 8);
  connection.query(
    "INSERT INTO users SET ?",
    {
      email: email,
      firtname: firtname,
      lastname: lastname,
      rol: rol,
      pass: passwordHash,
      _ss: _ss
    },
    async (error, results) => {
      if (error) {
        return console.log(error);
      }
      req.flash("info", "Flash is back!");
      res.redirect("workspace/admin");
    }
  );
});
// SIGNUP
// router.get("/signup", renderSignUp);
// router.post("/signup", signUp);

// LOGOUTH
router.get("/logout", async (req, res) => {
  req.send("cerrado");
});

module.exports = router;
