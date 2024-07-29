const connection = require("../../../connections/database/db-connect");
const redisClient = require("../../../connections/redis/redis-connect");
const { driveClient, disks } = require("../../../connections/minio/drive-connect");
const config = require("../../config")
const moment = require('moment');
const expirationTime = 5 * 24 * 60 * 60;
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
            const bucketName = config.BUCKET_NAME;
            const sqlSelect = `SELECT b.*, 
            (SELECT FORMAT(AVG(v.score), 2) FROM votes v WHERE v.bookID = b.bookID) AS rating,
            (SELECT COUNT(v.score) FROM votes v WHERE v.bookID = b.bookID AND v.reviewOn = 1) AS numVotes,
            (SELECT SUM(v.score) FROM votes v WHERE v.bookID = b.bookID ) AS totalScore,
            (SELECT v.reviewOn FROM votes v WHERE v.bookID = b.bookID AND v.reviewOn = 1 LIMIT 1) AS reviewOn,
            p.partnerID AS partnerID,
            p.dni AS partnerDni,
            b.reserved AS reserved,
            cb.nameCover as cover
        FROM 
            books b
        LEFT JOIN 
            bookings bk ON bk.bookID = b.bookID AND bk.delivered = 0
        LEFT JOIN 
            partners p ON p.dni = bk.partnerDni
        LEFT JOIN 
            coverBooks cb ON cb.bookID=b.bookID
        WHERE 
            b.bookID=?;`;
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
                const purchase = moment(results[0].purchase_date).format("MMMM Do, YYYY");
                    const update = moment(results[0].lastUpdate).format("MMMM Do, YYYY HH:mm A");
                const bookData = results.map(results => ({
                    ...results,
                    purchase_date: purchase,
                    lastUpdate: update
                }));
                const objectName = results[0].cover;
                let dataCover;
                if (objectName) {
                    driveClient.statObject(bucketName, objectName, async (err, stat) => {
                        if (stat !== undefined) {
                            await driveClient.presignedGetObject(bucketName, objectName, expirationTime, (err, url) => {
                                if (err) {
                                    console.err(err);
                                } else {
                                    dataCover = [{
                                        nameCover: objectName,
                                        urlCover: encodeURIComponent(url)
                                    }];
                                }
                            });
                        } else {
                            dataCover = [{
                                nameCover: null,
                                urlCover: null
                            }];
                        }
                        const dataInfoBook = [bookData, dataCover];
                        await redisClient.set(`bookInfo${bookID}`, JSON.stringify(dataInfoBook), (err, reply) => {
                            if (err) return console.error(err);
                            if (reply) {
                                redisClient.expire(`bookInfo${bookID}`, 28800);
                                res.status(200).render("workspace/books/infoBook", {
                                    loggedIn,
                                    rolAdmin,
                                    bookData,
                                    dataCover
                                });
                            }
                        });

                    });
                } else {
                    const dataCover = [{
                        nameCover: null,
                        urlCover: null
                    }];
                    const dataInfoBook = [bookData, dataCover];
                    await redisClient.set(`bookInfo${bookID}`, JSON.stringify(dataInfoBook), (err, reply) => {
                        if (err) return console.error(err);
                        if (reply) {
                            redisClient.expire(`bookInfo${bookID}`, 28800);
                            res.status(200).render("workspace/books/infoBook", {
                                loggedIn,
                                rolAdmin,
                                bookData,
                                dataCover
                            });
                        }
                    });
                }                
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getBooks: async (req, res) => {
        try {
            connection.query("SELECT * FROM books", async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 0) {
                    return res.status(200).send({
                        success: false,
                        swalTitle: "No found....!",
                        errorMessage:
                            "[ ERROR ], There are no data in the table books, Liburutegia.",
                        data: null
                    });
                }
                let data = results;
                await redisClient.set("books", JSON.stringify(data), 'NX', 'EX', 7200, (err, reply) => {
                    if (err) console.error(err)
                    if (reply) res.status(200).send(data);
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
};
module.exports = booksController;