const connection = require("../../../database/db");

const workSpaceController = {

    // TODO ✅ REDIRIGE A LA VISTA DE BOOKS
    getBooks: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.status(200).render("workspace/dashboard-books", {
                loggedIn,
                userName,
                rolAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ REDIRIGE A LA VISTA DE BOOKINGS
    getBookings: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.status(200).render("workspace/dashboard-bookings", {
                loggedIn,
                userName,
                rolAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ REDIRIGE A LA VISTA DE PARTNERS
    getPartners: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.status(200).render("workspace/dashboard-partners", {
                loggedIn,
                userName,
                rolAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ REDIRIGE A LA VISTA DE ADMIN
    getAdmin: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            
            sqlSelect = "SELECT * FROM users";
            connection.query(sqlSelect, async (err, results) => {
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
                const users = results;
                try {
                    if (rolAdmin === false) {
                        return res.status(400).redirect("/");
                    }
                    res
                        .status(200)
                        .render("workspace/dashboard-admin", {
                            loggedIn,
                            userName,
                            users,
                            rolAdmin
                        });
                } catch (error) {
                    console.error(error);
                    res.status(500).redirect("/");
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = workSpaceController;
