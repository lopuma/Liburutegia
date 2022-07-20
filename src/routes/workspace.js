const { query } = require('express');
const express = require('express');
const { link } = require('fs');
const { createPool } = require('mysql');
const router = express.Router();
const connection = require('../../database/db');
const session = require('express-session')

router.get('/books', async (req, res) => {
    //const books = await connection.query('SELECT * from books')
    const name = req.session.name;
    	const logueado = req.session.loggedin;
    	console.log("LOGUEDO VAL ", logueado);
        let url = '/api/books'
        if(logueado || name){
            const books = await url;
            res.render('workspace/dashboard-books', {
            login: true,
            name: req.session.name,
            books, 
          });
        }else{
            res.render('workspace/login',{
                login: false,
                name: ''
            });
        }
      });;
    

router.post('/books', async (req, res) => {
    const books = await connection.query('SELECT * from books')
    const name = req.session.name;
    res.send('../workspace/dashboard-books');
});


router.get('/bookings', async (req, res) => {
    const bookings = await connection.query('SELECT * from books')
    const name = req.session.name;
    res.render('workspace/dashboard-bookings', { name })
});

router.get('/partners', async (req, res) => {
    const partners = await connection.query('SELECT * from books')
    const name = req.session.name;
    res.render('workspace/dashboard-partners', { name })
});



// app.get('/dashboard-partners', async (req, res) => {
// 	const name = req.session.name;
// 	const logueado = req.session.loggedin;
//     let url = '/api/partners'
//     if(logueado || name){
//         const partners = await url;
//         res.render('workspace/dashboard-partners', {
//         login: true,
//         name: req.session.name,
//         partners, 
//       });
//     }else{
//         res.render('workspace/login',{
//             login: false,
//             name: ''
//         });
//     }
//   });;



//   app.get('/dashboard-books', async (req, res) => {
// 	const name = req.session.name;
// 	const logueado = req.session.loggedin;
// 	console.log("LOGUEDO VAL ", logueado);
//     let url = '/api/books'
//     if(logueado || name){
//         const books = await url;
//         res.render('workspace/dashboard-books', {
//         login: true,
//         name: req.session.name,
//         books, 
//       });
//     }else{
//         res.render('workspace/login',{
//             login: false,
//             name: ''
//         });
//     }
//   });;
module.exports = router;