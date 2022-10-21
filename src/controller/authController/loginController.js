const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");
const flash = require('connect-flash');

const { body, validationResult } = require('express-validator');
const loginController = {

    validate: [
        body('email', "The format email address is incorrect.").exists().isEmail(),
        body('password', "\nPassword must contain the following: Minimun 5 characters").exists().isLength({ min: 5 })
    ],
    asigneRol: async (req, res, results) => { // TODO PERFECT
        try {
            const rol = await results[0].rol;
            if (rol == 'admin' || rol == 'Admin') {
                ruta = "workspace/admin";
                roladmin = true;
            } else {
                ruta = "workspace/books";
                roladmin = false;
            }
            req.session.ruta = ruta;
            req.session.rol = rol;
            req.session.roladmin = roladmin;
        } catch (error) {
            console.log(error)
            res.status(404).redirect("/")
        }
    },
    isAuthenticated: async (req, res, next) => { // TODO PERFECT
        const loggedIn = req.session.loggedin;
        try {
            loggedIn ? next() : res.redirect("/");
        } catch (error) {
            console.log(error)
            res.status(404).redirect("/")
        }
    },
    postLogin: async (req, res) => { // TODO PERFECT
        try {
            const errors = validationResult(req);
            const { email, password: pass } = req.body;
            if (!errors.isEmpty()) {
                req.flash("errorValidation", errors.array())
                return res.redirect('/login');
            }
            if (email || pass) {
                sql = "SELECT * FROM users WHERE email = ?";
                connection.query(sql, [email], async (err, results) => {
                    if (err || results.length === 0 || !await bscryptjs.compare(pass, results[0].pass)) {
                        req.flash("errorMessage", "These credentials do not match our records.")
                        return res.redirect('/login');
                    }
                    await loginController.asigneRol(req, res, results);
                    req.session.loggedin = true;
                    req.session.username = results[0].username;
                    req.session.usermail = results[0].email;
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
            console.log(error)
            res.redirect("/")
        }
    },
    getLogin: async (req, res) => { //TODO PERFECT 
        const loggedIn = req.session.loggedin;
        const ruta = req.session.ruta;
        try {
            loggedIn ?
                res.status(200).redirect(ruta) :
                res.status(200).render('forms/login', {
                    loggedIn: false,
                    userName: ""
                });
        } catch (error) {
            console.log(error)
            res.status(404).redirect("/")
        }
    }
}

module.exports = loginController;