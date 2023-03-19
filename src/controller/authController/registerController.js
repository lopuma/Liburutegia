const connection = require("../../../connections/database/db-connect");
const bscryptjs = require("bcryptjs");
const redisClient = require("../../../connections/redis/redis-connect");
const routerRegister = {
    getRegister: async function (req, res) {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const userMail = req.session.usermail;
            const rolAdmin = req.session.roladmin;
            rolAdmin === false
                ? res.status(400).redirect("/")
                : res.status(200).render("../views/forms/register", {
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
    postRegister: async function (req, res) {
        try {
            const { email, username, fullname, rol, pass } = req.body;
            const _ss = 0;
            let passwordHash = await bscryptjs.hash(pass.trim(), 8);
            const sql = "SELECT * FROM users WHERE email = ?";
            connection.query(sql, [email], async (err, results) => {
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
                    sqlInsert = "INSERT INTO users SET ?";
                    connection.query(
                        sqlInsert,
                        {
                            email: email.trim(),
                            username: username.trim(),
                            fullname: fullname.trim(),
                            rol,
                            pass: passwordHash,
                            _ss
                        },
                        async (err) => {
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
                            try {
                                await redisClient.del('users');
                            } catch (error) { }
                            res.status(200).send({
                                exists: false,
                                inputs: false,
                                messageSuccess: `User ${username} created successfully.`
                            });
                        }
                    );
                } else {
                    return res.status(300).send({
                        success: false,
                        exists: true,
                        inputs: true,
                        messageError: `The email:  ${email}, already exists, it is associated with the username : ${results[0]
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
