const connection = require("../../../database/db");

const bscryptjs = require("bcryptjs");

const flash = require('connect-flash');

const { body, validationResult } = require('express-validator');

const loginController = {
    // TODO ✅ VALIDA USUER E MAIL
    validate: [
        body("inputEmailLogin", "The format email address is incorrect,\nFormat correct is 'example@example.com' and without space please.").exists().isEmail().trim(),
        body(
            "inputPassword",
            "Password must contain the following: Minimun 5 characters."
        )
            .exists()
            .isLength({ min: 5 })
    ],

    // TODO ✅ ASIGNA ROL
    asigneRol: async (req, res, isRol) => {
        try {
            const rol = await isRol;
            if (rol == "admin" || rol == "Admin") {
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
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ SI ES AUTHENTICATION IS TRUE
    isAuthenticated: async (req, res, next) => {
        const loggedIn = req.session.loggedin;
        try {
            loggedIn ? next() : res.status(400).redirect("/");
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ AUTHENTICATION Y REDIRIGE A LA RUTA DEPENDE EL ROL
    postLogin: async (req, res) => {
        try {
            const errors = validationResult(req);
            const { inputEmailLogin: email, inputPassword: pass } = req.body;
            console.log({
                email,
                pass
            })
            if (!errors.isEmpty()) {
                req.flash("errorValidation", errors.array());
                return res.status(300).redirect("/login");
            }

            if (email || pass) {
                const sqlSelect = "SELECT * FROM users WHERE email = ?";
                await connection.query(sqlSelect, [email], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res
                            .status(400)
                            .send({
                                success: false,
                                messageErrBD: err,
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                    }
                    if (results.length === 0) {
                        req.flash(
                            "errorUser",
                            "Your account could not be found in Liburutegia."
                        );
                        req.flash("errorPassword", "");
                        return res.status(300).redirect("/login");
                    }
                    if (!await bscryptjs.compare(pass, results[0].pass)) {
                        req.flash("errorPassword", "Wrong password. Try again or click Forgot password to reset it.");
                        req.flash("errorUser", "");
                        return res.status(300).redirect("/login");
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
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ REDIRIGE A LA VISTA DE LOGIN
    getLogin: async (req, res) => {
        const loggedIn = req.session.loggedin;
        const ruta = req.session.ruta;
        try {
            if (loggedIn) {
                return res.status(200).redirect(ruta);
            }
            res.status(200).render("forms/login", {
                loggedIn: false,
                userName: "",
                userPath: ""
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }

};

module.exports = loginController;