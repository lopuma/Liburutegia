const express = require('express');
const router = express.Router();
const connection = require('../../database/db');
const session = require('express-session');

router.get('/', async (req, res) =>{
    const logueado = req.session.loggedin;
    let url = '/api/books'
    console.log(logueado);
    if(logueado){
        const books = await url;
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

