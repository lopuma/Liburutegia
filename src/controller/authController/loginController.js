const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");
const flash = require('connect-flash');

const { body, validationResult } = require('express-validator');

const loginController = {
    
    validate: [ 
        body('email', "The format email address is incorrect.").isEmail(),
        body('password', "Password must contain the following: Minimun 5 characters").exists().isLength({min: 5})
    ],
    asigneRol: async (req, res, results) => {
        try {
            const rol = await results[0].rol;
            if (rol == 'admin' || rol == 'Admin') {
                ruta = "workspace/admin";
                rolAdmin = true;
            } else {
                ruta = "workspace/books";
                rolAdmin = false;
            }
            req.session.ruta = ruta;
            req.session.rol = rol;
            req.session.roladmin = rolAdmin;
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })    
        }
    },
    isAuthenticated: async (req, res, next) => {
        const loggedIn = req.session.loggedin;
        if (loggedIn) {
            try {
                return next()
            }   catch (error) {
                    throw res.status(400).send({
                        success: false,
                        message: error.message
                    })          
            }
        } else {
            res.redirect("/");
        }
    },
    postLogin: async (req, res) => {
        try {
            const errors = validationResult(req);
            const { email, password : pass } = req.body;
            if(!errors.isEmpty()){
                req.flash("errorValidation", errors.array()) 
                return res.redirect('/login');
            }
            if (email || pass ){
                sql = "SELECT * FROM users WHERE email = ?";
                connection.query(sql, [email], async (err, results) => {
                    if (err || results.length === 0 ||
                        !await bscryptjs.compare(pass, results[0].pass)) {
                            req.flash("errorMessage", "These credentials do not match our records.") 
                            return res.redirect('/login');
                    }
                    ruta = await loginController.asigneRol(req, res, results);
                    req.session.loggedin = true;
                    req.session.username = results[0].username;
                    req.session.usermail = results[0].email;
                    req.session.rol = results[0].rol;
                    res.render("forms/login", {
                        success: true,
                        alert: true,
                        alertTitle: "Conexion Success",
                        alertMessage: "!Login Success",
                        alertIcon: "success",
                        timer: 1000,
                        ruta
                    });
                });
            } 
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })  
        }
    },
    getLogin: async (req, res) => {
        try {
                const loggedIn = req.session.loggedin;
                if (loggedIn) {
                    const ruta = req.session.ruta;
                    return res.status(200).redirect(ruta);
                }
                res.status(400).render('forms/login', {
                    loggedIn: false,
                    userName: "",
                    errorMessage: req.flash("errorMessage") ,
                    errorValidation: req.flash("errorValidation")               
                });
            }
        catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })          
        }
    }
    
}

module.exports = loginController;