const connection = require("../../../database/db-connect");
const redisClient = require("../../../redis/redis-connect")
const moment = require('moment');
const config = require('../../config');
const Minio = require('minio');
const minioClient = new Minio.Client({
  endPoint: config.MINIO_HOST,
  port: 9000,
  useSSL: false,
  accessKey: config.MINIO_ROOT_USER,
  secretKey: config.MINIO_ROOT_PASSWORD
});
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
            console.log("BOOK 3 =>> ", bookID);
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlSelect = ["SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", "SELECT b.*, FORMAT(AVG(v.score), 2) AS rating, COUNT(v.score) AS numVotes, SUM(v.score) AS totalScore, v.reviewOn FROM votes v LEFT JOIN books b ON b.bookID=v.bookID WHERE b.bookID=? AND v.reviewOn>0", `SELECT p.partnerID AS partnerID, p.dni AS partnerDni, b.reserved as reserved FROM books b INNER JOIN bookings bk ON bk.bookID = b.bookID INNER JOIN partners p ON p.dni = bk.partnerDni WHERE b.bookID=${bookID} AND bk.delivered=0`,`SELECT b.* FROM books b WHERE b.bookID=${bookID}`, `SELECT cb.nameCover as cover FROM books b LEFT JOIN coverBooks cb ON cb.bookID=b.bookID WHERE b.bookID = ${bookID}`];
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
                const nameCover = results[4];
                const bucketName = 'mi-bucket';
                const objectName = nameCover[0].cover;
                const coverKey = `cover${bookID}`;
                console.log("OBJECT NAME =>> ", objectName)
                if(objectName !== null) {
                    minioClient.statObject(bucketName, objectName, async (err, stat) => {
                        console.log(stat)
                        minioClient.presignedUrl('GET', bucketName, objectName, 60 * 60 * 24, (err, url) => {
                            if (err) {
                              console.log(err);
                            } else {
                                coverData = [{
                                    nameCover: objectName,
                                    urlCover: url
                                }];
                            }
                          });
                        /*for (const key of Object.keys(coverData)) {
                            if(coverData[key] !== null) {
                                redisClient.hSet(coverKey, key, coverData[key], (err, reply) => {
                                    if (err) return console.error(err);
                                    redisClient.expire(coverKey, 3600);
                                });
                            }
                        }*/
                        
                        /*const dataInfoBook = [book, deliver, nameCover];
                        const bookKey = `bookInfo${bookID}`;
                        await redisClient.set(bookKey, JSON.stringify(dataInfoBook), (err, reply) => {
                            if (err) return console.error(err);
                            if (reply) redisClient.expire(bookKey, 3600);
                        });*/
                        res.status(200).render("workspace/books/infoBook", {
                            loggedIn,
                            rolAdmin,
                            book,
                            deliver,
                            coverData
                        });
                    });
                } else {
                    coverData = {
                        nameCover : null,
                        urlCover: null
                    };
                } 
                /*await redisClient.set(`bookInfo${bookID}`, JSON.stringify(dataInfoBook), 'NX', 'EX', 3600, (err, reply) => {
                    if(err) return console.error(err);
                    if(reply) {
                        res.status(200).render("workspace/books/infoBook", {
                            loggedIn,
                            rolAdmin,
                            book,
                            deliver
                        });
                    }
                });*/
                
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getInfoCover: async (req, res, next) => {
        try {
            const bookID = req.params.idBook;
            const nameCover = req.query.param1;
            const bucketName = 'mi-bucket';
            const objectName = nameCover;
            const coverKey = `cover${bookID}`;
            if(objectName !== null) {
                minioClient.statObject(bucketName, objectName, async (err, stat) => {
                    const url = err ? null : await minioClient.getObject(bucketName, objectName);
                    const coverData = {
                        nameCover : objectName,
                        urlCover: url
                    };
                    for (const key of Object.keys(coverData)) {
                        if(coverData[key] !== null) {
                            redisClient.hSet(coverKey, key, coverData[key], (err, reply) => {
                                if (err) return console.error(err);
                                redisClient.expire(coverKey, 3600);
                            });
                        }
                    }
                    res.status(200).send(coverData);
                })
            } else {
                const coverData = {
                    nameCover : null,
                    urlCover: null
                };
                res.status(200).send(coverData);
            } 
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};
module.exports = booksController;