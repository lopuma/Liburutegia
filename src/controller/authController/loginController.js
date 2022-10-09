const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");
const flash = require("connect-flash");

const loginController = {
    asigneRol: async (req, res, results) => {
        try {
            req.session.loggedin = true;
            req.session.name = results[0].firstname;
            req.session.email = results[0].email;
            rol = await results[0].rol;
            if (rol == 'admin' || rol == 'Admin') {
                req.session.rol = rol;
                login = true;
                ruta = "workspace/admin";
            } else {
                req.session.rol = "";
                ruta = "workspace/books";
            }
            req.session.ruta = ruta;
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })    
        }
        
    },
    postLogin: async (req, res) => {
        try {
            let body = req.body;
            if (body) {
                email = body.email;
                pass = body.password;
            }
            if (email && pass) {
                sql = "SELECT * FROM users WHERE email = ?";
                connection.query(sql, [email], async (err, results) => {
                if (err || results.length === 0 ||
                    !await bscryptjs.compare(pass, results[0].pass)) {
                        req.flash("errorMessage", "These credentials do not match our records.") 
                        res.redirect('/login')
                    }
                ruta = await loginController.asigneRol(req, res, results);
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
            // }
        } catch (error) {
            console.log(error);
        }
    },
    getLogin: async (req, res) => {
        try {
                const logueado = req.session.loggedin;
                const nameUser = req.session.name;
                const ruta = req.session.ruta;
                if (logueado) {
                login: true;
                nameUser;
                res.status(200).redirect(ruta);
            } else {
                res.status(400).render('forms/login', {
                    success: false,
                    nameUser: "",
                    errorMessage: req.flash("errorMessage"),
                  });
            }
            }
        catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })          
        }
    },
}

module.exports = loginController;