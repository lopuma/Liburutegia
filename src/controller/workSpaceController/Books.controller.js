const connection = require("../../../database/db");

const booksController = {

    // TODO ✅ REENVIAR A LA VISTA NUEVO BOOK
    getNew: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res
                .render("workspace/books/new",
                    {
                        loggedIn,
                        rolAdmin
                    });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    //TODO ✅ OBTENER LA VISTA DE INFORMACION de BOOKS
    getInfo: async (req, res) => {
        try {
            const id_book = req.params.idBook;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlSelect = "SELECT * FROM books WHERE id_book = ?";
            await connection.query(sqlSelect, [id_book], (err, results) => {
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
                const book = results;
                res.status(200).render("workspace/books/infoBook", {
                    loggedIn,
                    rolAdmin,
                    book
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }

};

module.exports = booksController;