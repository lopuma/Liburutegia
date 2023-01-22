const connection = require("../../../database/db");
const moment = require('moment');

const booksController = {

    // TODO ✅ REENVIAR A LA VISTA NUEVO BOOK
    getNew: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res
                .render("workspace/books/newBook",
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
            const bookID = req.params.idBook;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlSelect = ["SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", "SELECT b.*, FORMAT(AVG(v.score), 2) AS rating, COUNT(v.score) AS numVotes, SUM(v.score) AS totalScore, v.reviewOn FROM books b  LEFT JOIN bookings bk ON bk.bookID=b.bookID LEFT JOIN votes v ON v.bookingID=bk.bookingID WHERE b.bookID=? AND v.reviewOn>0", `SELECT p.partnerID AS partnerID, p.dni AS partnerDni, b.reserved as reserved FROM sanmiguel.books b INNER JOIN sanmiguel.bookings bk ON bk.bookID = b.bookID INNER JOIN sanmiguel.partners p ON p.dni = bk.partnerDni WHERE b.bookID = ${bookID} AND bk.delivered=0`,`SELECT b.*, FORMAT(AVG(v.score), 2) AS rating, COUNT(v.score) AS numVotes, SUM(v.score) AS totalScore, v.reviewOn FROM books b  LEFT JOIN bookings bk ON bk.bookID=b.bookID LEFT JOIN votes v ON v.bookingID=bk.bookingID WHERE b.bookID=${bookID}`];
            await connection.query(sqlSelect.join(";"), [bookID], (err, results) => {
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
                console.log(results[1]);
                const purchase = moment(results[1].purchase_date).format("MMMM Do, YYYY");
                const update = moment(results[1].lastUpdate).format("MMMM Do, YYYY HH:mm A");
                console.log("=>> ", results[1].lenght, results[1][0].bookID)
                let book = "";
                if (results[1][0].bookID === null) {
                    book = results[3].map(results => ({
                        ...results,
                        purchase_date: purchase,
                        lastUpdate: update
                    }));
                } else {
                    book = results[1].map(results => ({
                        ...results,
                        purchase_date: purchase,
                        lastUpdate: update
                    }));
                    
                }
                console.log("ES0TE ES EL RESULT QUE QUIERO ??", book);
                const deliver = results[2];
                res.status(200).render("workspace/books/infoBook", {
                    loggedIn,
                    rolAdmin,
                    book,
                    deliver
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    //TODO ✅ OBETNER LA PORTADA
    getInfoCover: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const sqlSelect = " SELECT cb.nameCover as cover FROM books b LEFT JOIN coverBooks cb ON cb.bookID=b.bookID WHERE b.bookID = ?";
            await connection.query(sqlSelect, [bookID], (err, results) => {
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
                res.status(200).send(book);
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }

};

module.exports = booksController;