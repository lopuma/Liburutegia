// const jwt = require('jsonwebtoken')
// const {promisify} = require('util')
const connection = require("../../database/db");
const bscryptjs = require("bcryptjs");

//procedimiento para registrarnos
// exports.register = async (req, res)=>{    
//     try {
//         const name = req.body.name
//         const user = req.body.user
//         const pass = req.body.pass
//         let passHash = await bcryptjs.hash(pass, 8)    
//         //console.log(passHash)   
//         conexion.query('INSERT INTO users SET ?', {user:user, name: name, pass:passHash}, (error, results)=>{
//             if(error){console.log(error)}
//             res.redirect('/')
//         })
//     } catch (error) {
//         console.log(error)
//     }       
// }

// CONTROLADOR PARA LOGIN
function asigneRol(req, results) {
    req.session.loggedin = true;
    req.session.name = results[0].firstname;
    req.session.email = results[0].email;
    rol = results[0].rol;
    console.log("QUE REIVO", req, results)
    if (rol == 'admin' || rol == 'Admin') {
        req.session.rol = rol;
        login = true;
        ruta = "workspace/admin";
    } else {
        req.session.rol = "";
        ruta = "workspace/books";
    }
    req.session.ruta = ruta;
}
exports.login = async (req, res) => {
    try {
        const logueado = req.session.loggedin;
        const nameUser = req.session.name;
        let body = req.body;
        if (body) {
            email = body.email;
            pass = body.password;
        }
        if (email && pass) {
            sql = "SELECT * FROM users WHERE email = ?";
            connection.query(sql, [email], async (error, results) => {
                if (
                    results.length == 0 ||
                    !await bscryptjs.compare(pass, results[0].pass)
                ) {
                    req.flash("error_msg", "These credentials do not match our records.");
                    res.send(
                        {
                            Error: error
                        },
                        res.redirect("/login")
                    );
                } else {
                    asigneRol(req, results);
                    res.render("../views/forms/login", {
                        Success: results[0].email,
                        alert: true,
                        alertTitle: "Conexion Success",
                        alertMessage: "!Login Success",
                        alertIcon: "success",
                        timer: 2000,
                        ruta
                    });
                }
            });
        }
        // }
    } catch (error) {
        console.log(error);
    }
}


exports.isAuthenticated = async (req, res, next) => {
    const logueado = req.session.loggedin;
    console.log("SESSION ", logueado)
    if (logueado) {
        try {
            const decodificada = req.session.email;
            console.log(decodificada)
            // const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM users WHERE email = ?', [decodificada], (error, results) => {
                if (!results) { return next() }
                req.user = results[0].firstname
                console.log("ROL => ", results[0])
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.render('index')
    }
}

// exports.logout = (req, res)=>{
//     res.clearCookie('jwt')   
//     return res.redirect('/')
// }