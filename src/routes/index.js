const express = require('express');
const router = express.Router();
const connection = require("../../database/db");
const bscryptjs = require("bcryptjs");

router.get('/', async (req, res) => {
  const nameUser = req.session.name;
  const logueado = req.session.loggedin;
  const userRol = req.session.rol;
  let passwordHash = await bscryptjs.hash('admin', 8);
  if(logueado && userRol){
    login: true, nameUser, userRol;
    res.redirect('workspace/admin');
  } else if (logueado || nameUser) {
    login: true, nameUser;
    res.redirect('workspace/books');
  } else {
    sql = "SELECT IF( EXISTS(SELECT * FROM users WHERE email='admin@mail.com'), 1, 0) AS respuesta";
    sqlDelete = "DELETE FROM users";
    sqlInsert = "INSERT INTO users SET ?";
    connection.query(sql, async (error, results) => {
      if (results){
        console.log("EXISTE RESPUESTA :", results[0].respuesta)
        existe = results[0].respuesta;
        if(existe != 1){
          connection.query(
            sqlInsert,
            {
              email:'admin@mail.com',
              firstname:'Admin',
              lastname:'Admin',
              rol:'admin',
              pass: passwordHash,
              _ss:0
            }, async (error, result) =>{
              console.log("Usuario inicial creado : ", result)
            });
        }
      }
    });
    login: false;
    nameUser: '';
    res.render('index');
  }
});




// router.get('/', async (req, res) => {

//     res.render('index');
// });



router.post('/', (req, res) => {
  console.log(req.body);
  res.send('Data received');
})

module.exports = router;

