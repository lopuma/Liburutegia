const connection = require("../../../database/db");

const bscryptjs = require("bcryptjs");

const flash = require("connect-flash");

const routerRegister = {
    // TODO ✅ REDIRIGE A LA VISTA DE REGISTRO
    getRegister: async function (req, res) {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const userMail = req.session.usermail;
            const rolAdmin = req.session.roladmin;
            rolAdmin === false
                ? res.redirect("/")
                : res.render("../views/forms/register", {
                    loggedIn,
                    userName,
                    userMail,
                    rolAdmin
                });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ AÑADE NUEVO USUARIO DE LIBURUTEGIA
    postRegister: async function (req, res) {
        try {
            const { email, username, fullname, rol, pass } = req.body;
            const _ss = 0;
            let passwordHash = await bscryptjs.hash(pass.trim(), 8);
            const sql = "SELECT * FROM users WHERE email = ?";
            await connection.query(sql, [email], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    });
                }
                if (results.length === 0) {
                    sqlInsert = "INSERT INTO users SET ?";
                    await connection.query(
                        sqlInsert,
                        {
                            email: email.trim(),
                            username: username.trim(),
                            fullname: fullname.trim(),
                            rol,
                            pass: passwordHash,
                            _ss
                        },
                        err => {
                            if (err) {
                                console.error("[ DB ]", err.sqlMessage);
                                return res.status(400).send({
                                    code: 400,
                                    message: err
                                });
                            }
                            res.send({
                                status: 200,
                                exists: false,
                                inputs: false,
                                message: `User ${username} created successfully.`
                            });
                        }
                    );
                } else {
                    return res.send({
                        status: 400,
                        exists: true,
                        inputs: true,
                        message: `The email:  ${email}, already exists, it is associated with the username : ${results[0]
                            .username}`
                    });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = routerRegister;
