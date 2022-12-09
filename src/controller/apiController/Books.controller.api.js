const connection = require("../../../database/db");

const bookController = {

    noExistBook: async (req, res, next) => {
        try {
            const id_book = req.params.idBook;
            const sqlSelect = "SELECT * FROM books WHERE id_book = ?";
            await connection.query(sqlSelect, [id_book], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 0) {
                    return res
                        .status(404)
                        .send({
                            success: false,
                            exists: false,
                            errorMessage: `Error there is no book with ID BOOK: ${id_book}`
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
    getBooks: async (req, res) => {
        try {
            await connection.query("SELECT * FROM books", (err, results) => {
                if (err || results.length === 0) {
                    return res.status(200).send({
                        success: true,
                        message: "No data found for BOOKS"
                    });
                }
                res.status(200).send({
                    data: results
                });
            });
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            });
        }
    },
    // SHOW ONLY BOOK FOR ID
    getBook: async (req, res) => {
        try {
            const id_book = req.params.id_book;
            let sql = `SELECT * FROM books WHERE id_book = ${id_book}`;
            await connection.query(sql, (err, results) => {
                if (err || results.length === 0) {
                    return res.status(404).send({
                        success: true,
                        message: "No data found for BOOKS",
                        error: err
                    });
                }
                res.send(
                    JSON.stringify({
                        success: true,
                        message: `Successfully found book with ID : ${results[0].id_book}`,
                        data: results[0]
                    })
                );
            });
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            });
        }
    },
    // UDATE BOOK FOR ID
    putBook: async (req, res) => {
        try {
            id_book = req.params.id_book;
            title = req.body.title_book;
            author = req.body.author;
            type = req.body.type;
            language = req.body.language;
            let sql =
                "UPDATE books SET title = ?, author = ?, type = ?, language = ? WHERE id_book = ?";
            connection.query(sql, [title, author, type, language, id_book], function (
                error,
                result
            ) {
                if (error) {
                    throw error;
                } else {
                    res.send(result);
                }
            });
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            });
        }
    },
    // TODO ENTREGA
    deliverBook: async (req, res) => {
        const idBook = req.params.id_book;
        const { idBooking, score, review, deliver_date_review } = req.body;
        const sql = [
            `UPDATE books SET reserved=0 WHERE id_book=${idBook}`,
            "INSERT INTO votes SET ?"
        ];
        await connection.query(
            sql.join(";"),
            {
                book_id: idBook,
                id_booking: idBooking,
                score,
                review,
                deliver_date_review
            },
            (err, result) => {
                if (err) {
                    res.status(404).redirect("/");
                    //return console.log(err)
                }
                res.end(
                    `The following BOOK has been delivered with ID : ${idBook}, and a review has been added`
                );
            }
        );
    },
    // TODO DELETE
    deleteBook: async (req, res) => {
        const idBook = req.params.idBook;
        sql = "DELETE FROM books WHERE id_book=?";
        connection.query(sql, [idBook], (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).send({
                success: true,
                message: `The book with id ${idBook} has been successfully deleted`
            });
        });
    }
};

module.exports = bookController;