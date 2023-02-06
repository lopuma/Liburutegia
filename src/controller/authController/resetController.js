const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");
const flash = require('connect-flash');

const routerReset = {

    // TODO ✅ VALIDACION SI EL USUARIO EXISTE
    userExists: async (req, res, next) => {
        try {
            const { emailReset } = req.body;
            const sql = "SELECT * FROM users WHERE email = ?";
            connection.query(sql, [emailReset], async (err, results) => {
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
                    req.session.exists = false;
                    return res.status(300).send({
                        messageEmailReset:
                            "Your account could not be found in Liburutegia.",
                        exists: req.session.exists,
                        inputs: false
                    });
                } else {
                    next();
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ RESTABLECER PASSWORD
    postReset: async (req, res) => {
        try {
            const { emailReset, passReset } = req.body;
            req.session.exists = true;
            if (passReset === "") {
                return res.status(300).send({
                    errorValidation: "The password cannot be empty",
                    exists: req.session.exists,
                    inputs: true
                });
            }
            if (passReset !== undefined) {
                let passwordHash = await bscryptjs.hash(passReset, 8);
                const sql = `UPDATE users set pass="${passwordHash}" WHERE email = ?`;
                connection.query(sql, emailReset, (err) => {
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
                    res.status(200).send({
                        successValidation: "Password has been changed successfully",
                        exists: req.session.exists,
                        inputs: false
                    });
                });
            } else {
                return res.status(300).send({
                    successValidation: "User exists in the Liburutegia databases",
                    exists: req.session.exists,
                    inputs: true
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }

};

module.exports = routerReset;
