const express = require('express');
const router = express.Router();
const connection = require('../database');
const session = require('express-session');

router.get('/', async (req, res) =>{
    const logueado = req.session.loggedin;
    console.log("------", logueado)
    if(req.session.loggedin){
        const books = await connection.query('SELECT * from books')
        res.render('links/dashboard-books', {
        login: true,
        name: req.session.name,
        books, 
      });
    }else{
        res.render('index',{
            login: false,
            name: ''
        })
    }
  });
  

module.exports = router;

