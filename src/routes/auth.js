const express = require('express');
const router = express.Router();
const connection = require('../../database/db')

router.post('/auth', async (req, res)=> {
    const email = req.body.email;
    const pass = req.body.pass;    
    //let passwordHash = await bcrypt.hash(pass, 8);
    if (email && pass) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
            if( results.length == 0 || await pass != results[0].pass ) {    
                req.session.loggedin = false;                
                req.session.name = "";    
                res.redirect('/login');
                } else {         
                    //creamos una var de session y le asignamos true si INICIO SESSION 
                    req.session.loggedin = true;                
                    req.session.name = results[0].firtname;
                    res.redirect('../workspace/books');        			
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
    const nameUser = req.session.name;
    if(logueado){
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

// SIGNUP
// router.get("/signup", renderSignUp);
// router.post("/signup", signUp);

// LOGOUTH
router.get("/logout", async(req, res)=> {
    req.send("cerrado")
});

module.exports = router;