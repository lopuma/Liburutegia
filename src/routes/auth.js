const express = require('express');
const router = express.Router();
const connection = require('../../database/db')
const Swal = require('sweetalert2')

router.post('/auth', async (req, res)=> {
    const email = req.body.email;
    const pass = req.body.pass;    
    //let passwordHash = await bcrypt.hash(pass, 8);
    if (email && pass) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
            if( results.length == 0 || await pass != results[0].pass ) {    
                // Swal.fire({
                //     title: 'Error!',
                //     text: 'Do you want to continue',
                //     icon: 'error',
                //     confirmButtonText: 'Cool'
                //   });
                  console.log("no ets logueado")
                  req.session.loggedin = false;
                  res.redirect('/login');
                } else {         
                //creamos una var de session y le asignamos true si INICIO SESSION 
                req.session.loggedin = true;                
                req.session.name = results[0].firtname;
                res.redirect('/dashboard');        			
            }			
            res.end();
        });
    } else {	
        res.send('Please enter user and Password!');
        res.end();
    }
});
    
// SINGIN
router.get('/login', async (req, res) =>{
    const logueado = req.session.loggedin;
    let url = '/api/books'
    if(logueado){
        const books = await url;
        res.render('links/dashboard-books', {
        login: true,
        name: req.session.name,
        books, 
      });
    }else{
        res.render('links/login',{
            login: false,
            name: ''
        });
    }
  });

router.post('/login', async (req, res) => {
    res.redirect('/dashboard');
});

// SIGNUP
// router.get("/signup", renderSignUp);
// router.post("/signup", signUp);

// LOGOUTH
router.get("/logout", async(req, res)=> {
    req.send("cerrado")
});

module.exports = router;