const express = require('express');
const router = express.Router();
const connection = require("../../database/db");
const bscryptjs = require("bcryptjs");

const authController = require('../controller/authController')

router.get('/', authController.isAuthenticated, async (req, res, next) => {
  const nameUser = req.session.name;
  const logueado = req.session.loggedin;
  const userRol = req.session.rol;
  // let passwordHash = await bscryptjs.hash('admin', 8);
  if(logueado && userRol){
    login: true, nameUser, userRol;
    res.redirect('workspace/admin');
  } else if (logueado || nameUser) {
    login: true, nameUser;
    res.redirect('workspace/books');
  } else{
      login: false;
      nameUser: '';
      res.render('index')
  }
});




// router.get('/', async (req, res) => {

//     res.render('index');
// });



router.post('/', (req, res) => {
  console.log("Hola");
  res.send('Data received');
})

module.exports = router;

