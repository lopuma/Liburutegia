const express = require('express');
const router = express.Router();

router.get('/books', async (req, res) => {
    //const books = await connection.query('SELECT * from books')
        const nameUser = req.session.name;
    	const logueado = req.session.loggedin;
        console.log("QUIERO VER DESDE DONDE LLEGAS");
        if(logueado || nameUser){
            res.render('workspace/dashboard-books', {
            login: true,
            nameUser,
          });
        }else{
            res.render('../controllers/login',{
                login: false,
                nameUser: ''
            });
        }
      });


router.get('/bookings', async (req, res) => {
    const nameUser = req.session.name;
    const logueado = req.session.loggedin;
    if(logueado || nameUser){
        res.render('workspace/dashboard-bookings', {
        login: true,
        nameUser
    });
    }else{
        res.render('../controllers/login',{
            login: false,
            nameUser: ''
        });
    }
    });

router.get('/partners', async (req, res) => {
        const nameUser = req.session.name;
    	const logueado = req.session.loggedin;
        if(logueado || name){
            res.render('workspace/dashboard-partners', {
            login: true,
            nameUser,
          });
        }else{
            res.render('../controllers/login',{
                login: false,
                nameUser: ''
            });
        }
      });

module.exports = router;