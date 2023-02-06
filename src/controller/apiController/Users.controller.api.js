const connection = require('../../../database/db');

const routerUser = {

    userExists: async (req, res, next) => {
        try {
            const userID = req.params.idUser || req.body.idUser;
            const sql = "SELECT * FROM users WHERE id = ?";
            connection.query(sql, [userID], async (err, results) => {
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
                    return res.status(200).send({
                        success: false,
                        swalTitle: "",
                        errorMessage:
                            "Your account could not be found in Liburutegia.",
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
    getUser: async (req, res) => {
        try {
            const userID = req.params.idUser || req.body.idUser;
            const sqlSelectUser = "SELECT * FROM users WHERE id = ?";
    
            connection.query(sqlSelectUser, [userID], async (err, results) => {
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
                const data = results[0];
                res.status(200).send({
                    success: true,
                    swalTitle: "Succes...",
                    messageSuccess: "User exists.",
                    data
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    postUser: async (req, res) => {
        try {
            const userID = req.params.idUser || req.body.idUser;
            const sqlUpdatedUser = `UPDATE users SET ? WHERE id=${userID}`;
            const { username, email, fullname } = req.body;

            connection.query(sqlUpdatedUser, {username, email, fullname}, async (err, results) => {
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
                    success: true,
                    swalTitle: "Updated...",
                    messageSuccess: "It's update successfully"
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    deleteUser: async(req, res) => {
        try {
            const userID = req.params.idUser || req.body.idUser;
            const sqlDeleteUser = `DELETE FROM users WHERE id=${userID}`;
            connection.query(sqlDeleteUser, (err, results) => {
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
                    success: true,
                    swalTitle: "Deleted...",
                    messageSuccess: "It's deleted successfully"
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

};

module.exports = routerUser;

