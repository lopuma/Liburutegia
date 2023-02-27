const connection = require("../../../database/db-connect");
const redisClient = require("../../../redis/redis-connect")

const moment = require('moment');
let _CACHEBOOK =  false;

const booksController = {
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
    getInfo: async (req, res) => {
        try {
            const bookID = req.params.idBook || req.body.idBook;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlSelect = ["SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", "SELECT b.*, FORMAT(AVG(v.score), 2) AS rating, COUNT(v.score) AS numVotes, SUM(v.score) AS totalScore, v.reviewOn FROM votes v LEFT JOIN books b ON b.bookID=v.bookID WHERE b.bookID=? AND v.reviewOn>0", `SELECT p.partnerID AS partnerID, p.dni AS partnerDni, b.reserved as reserved FROM books b INNER JOIN bookings bk ON bk.bookID = b.bookID INNER JOIN partners p ON p.dni = bk.partnerDni WHERE b.bookID=${bookID} AND bk.delivered=0`,`SELECT b.* FROM books b WHERE b.bookID=${bookID}`];
            connection.query(sqlSelect.join(";"), [bookID], async (err, results) => {
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
                let book = "";
                if (results[1][0].bookID === null) {
                    const purchase = moment(results[3][0].purchase_date).format("MMMM Do, YYYY");
                    const update = moment(results[3][0].lastUpdate).format("MMMM Do, YYYY HH:mm A");
                    book = results[3].map(results => ({
                        ...results,
                        purchase_date: purchase,
                        lastUpdate: update
                    }));
                } else {
                    const purchase = moment(results[1][0].purchase_date).format("MMMM Do, YYYY");
                    const update = moment(results[1][0].lastUpdate).format("MMMM Do, YYYY HH:mm A");
                    book = results[1].map(results => ({
                        ...results,
                        purchase_date: purchase,
                        lastUpdate: update
                    }));
                }
                const deliver = results[2];
                const dataInfoBook = [book, deliver];
                await redisClient.set(`bookInfo${bookID}`, JSON.stringify(dataInfoBook), 'NX', 'EX', 3600, (err, reply) => {
                    if(err) return console.error(err);
                    if(reply) {
                        return res.status(200).render("workspace/books/infoBook", {
                            loggedIn,
                            rolAdmin,
                            book,
                            deliver
                        });
                    }
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getInfoCover: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const sqlSelect = " SELECT cb.nameCover as cover FROM books b LEFT JOIN coverBooks cb ON cb.bookID=b.bookID WHERE b.bookID = ?";
            connection.query(sqlSelect, [bookID], async (err, results) => {
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
                await redisClient.set(`cover${bookID}`, JSON.stringify(book), 'NX', 'EX', 3600, (err, reply) => {
                    if(err) return console.error(err);
                    if(reply) res.status(200).send(book);
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};
module.exports = booksController;