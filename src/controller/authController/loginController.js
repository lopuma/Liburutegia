const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");
const flash = require('connect-flash');

const { body, validationResult } = require('express-validator');
const loginController = {

    validate: [ // TODO ✅
        body('email', "- The format email address is incorrect.").exists().isEmail(),
        body('password', "- Password must contain the following: Minimun 5 characters").exists().isLength({ min: 5 })
    ],
    asigneRol: async (req, res, isRol) => { // TODO ✅
        try {
            const rol = await isRol;
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
            console.error(error)
            res.status(500).redirect("/")
        }
    },
    isAuthenticated: async (req, res, next) => { // TODO ✅
        const loggedIn = req.session.loggedin;
        try {
            loggedIn ? next() : res.redirect("/");
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    postLogin: async (req, res) => { // TODO ✅
        try {
            const errors = validationResult(req);
            const { email, password: pass } = req.body;
            console.log(errors.array())
            if (!errors.isEmpty()) {
                req.flash("errorValidation", errors.array())
                return res.redirect('/login');
            }
            if (email || pass) {
                const sql = "SELECT * FROM users WHERE email = ?";
                await connection.query(sql, [email], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            code: 400,
                            message: err
                        });
                    } else if (results.length === 0 || !await bscryptjs.compare(pass, results[0].pass)) {
                        req.flash("errorMessage", "- These credentials do not match our records.")
                        return res.redirect('/login');
                    }

                    //TODO LLAMADA ASIGNACION DE ROL Y RUTA
                    await loginController.asigneRol(req, res, results[0].rol);

                    //TODO SI TODO ES OK, SE REDIRIGE A SU RUTA
                    req.session.loggedin = true;
                    req.session.username = results[0].username;
                    req.session.usermail = results[0].email;
                    req.session.profile = results;
                    res.status(200).render("forms/login", {
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
            console.error(error)
            res.status(500).redirect("/")
        }
    },
    getLogin: async (req, res) => { // TODO ✅
        const loggedIn = req.session.loggedin;
        const ruta = req.session.ruta;
        try {
            loggedIn ?
                res.status(200).redirect(ruta) :
                res.status(200).render('forms/login', {
                    loggedIn: false,
                    userName: "",
                    userPath: ""
                });
        } catch (error) {
            console.error(error)
            res.status(500).redirect("/")
        }
    }
}

module.exports = loginController;