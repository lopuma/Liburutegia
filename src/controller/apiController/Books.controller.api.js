const connection = require("../../../connections/database/db-connect");
const redisClient = require("../../../connections/redis/redis-connect");
const { driveClient, disks } = require("../../../connections/minio/drive-connect");
const config = require('../../config');
const sharp = require('sharp');
const fs = require('fs')
const path = require('path');
const moment = require('moment');
const { body, validationResult } = require("express-validator");
const bookController = {
    validate: [
        body("title")
            .trim()
            .not()
            .isEmpty()
            .withMessage("This field `Title` is required"),
        body("author")
            .trim()
            .not()
            .isEmpty()
            .withMessage("This field `Author` is required"),
        body("isbn")
            .trim()
            .not()
            .isEmpty()
            .withMessage("This field `ISBN` is required")
    ],
    noExistBook: async (req, res, next) => {
        try {
            const bookID = req.params.idBook;
            if (bookID !== 'isbn') {
                const sqlSelect = "SELECT * FROM books WHERE bookID = ?";
                connection.query(sqlSelect, [bookID], (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            swalTitle: "[ ERROR DB ]",
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    if (results.length === 0) {
                        return res.status(403).send({
                            success: false,
                            exists: false,
                            swalTitle: "[ Error  not found ]",
                            errorMessage: `[ ERROR ], The BOOK with ID : ${bookID} does not exist`
                        });
                    } else {
                        next();
                    }
                });
                return;
            }
            res.status(200).send({
                success: false
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    redisBooks: async (req, res, next) => {
        await redisClient.get('books', function (err, reply) {
            if (reply) {
                const data = JSON.parse(reply);
                return res.status(200).send(data);
            }
            next();
        });
    },
    redisBook: async (req, res, next) => {
        const bookID = req.params.idBook || req.body.idBook;
        await redisClient.get(`book${bookID}`, (err, reply) => {
            if (reply) {
                const data = JSON.parse(reply);
                res.status(200).send(data);
            }
            next();
        });
    },
    redisInfoBook: async (req, res, next) => {
        try {
            const bookID = req.params.idBook || req.body.idBook;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            let listInfo = []
            await redisClient.get(`bookInfo${bookID}`, async (err, reply) => {
                if (reply) {
                    const data = await JSON.parse(reply);
                    data.forEach(element => {
                        listInfo.push(element);
                    });
                    const bookData = listInfo[0];
                    const dataCover = listInfo[1];
                    return res.status(200).render("workspace/books/infoBook", {
                        loggedIn,
                        rolAdmin,
                        bookData,
                        dataCover
                    });
                }
                next();
            });
        } catch (error) {

        }
    },
    redisInfoReview: async (req, res, next) => {
        const bookID = req.params.idBook || req.body.idBook;
        await redisClient.get(`review${bookID}`, (err, reply) => {
            if (reply) {
                const data = JSON.parse(reply);
                return res.status(200).send({
                    success: true,
                    swalTitle: "[ Success.... ]",
                    messageSuccess: "Success",
                    data
                });
            }
            next();
        });
    },
    getBooks: async (req, res) => {
        try {
            const { id: bookID, isbn, author, title } = req.query;
            if (Object.keys(req.query).some(key => !['id', 'isbn', 'author', 'title'].includes(key))) {
                return res.status(400).send({
                    success: false,
                    messageErrBD: "Invalid parameters were provided, you can query with the following parameters [ 'id', 'author', 'isbn', 'title ]",
                    swalTitle: "[ Query error ]",
                    errorMessage: "Invalid parameters were provided, you can query with the following parameters [ 'id', 'author', 'isbn', 'title' ]"
                });
            }
            if (bookID !== undefined && bookID === '') {
                return res.status(400).send({
                    success: false,
                    messageErrBD: "Parameter 'id' does not have a valid value",
                    swalTitle: "[ Query error ]",
                    errorMessage: "Parameter 'id' does not have a valid value",
                });
            }
            // Verificar si el parámetro 'isbn' está presente y tiene un valor válido
            if (isbn !== undefined && isbn === '') {
                return res.status(400).send({
                    success: false,
                    messageErrBD: "Parameter 'isbn' does not have a valid value",
                    swalTitle: "[ Query error ]",
                    errorMessage: "Parameter 'isbn' does not have a valid value",
                });
            }
            // Verificar si el parámetro 'author' está presente y tiene un valor válido
            if (author !== undefined && author === '') {
                return res.status(400).send({
                    success: false,
                    messageErrBD: "Parameter 'author' does not have a valid value",
                    swalTitle: "[ Query error ]",
                    errorMessage: "Parameter 'author' does not have a valid value",
                });
            }
            // Verificar si el parámetro 'title' está presente y tiene un valor válido
            if (title !== undefined && title === '') {
                return res.status(400).send({
                    success: false,
                    messageErrBD: "Parameter 'title' does not have a valid value",
                    swalTitle: "[ Query error ]",
                    errorMessage: "Parameter 'title' does not have a valid value",
                });
            }

            let sqlSelectBook = `SELECT * FROM books`;
            let query = [];

            if (bookID) {
                if (isNaN(bookID)) {
                    return res.status(400).send({
                        success: false,
                        messageErrBD: "The 'id' parameter must be a number",
                        swalTitle: "[ Parameter error ]",
                        errorMessage: "The 'id' parameter must be a number",
                    });
                }
                sqlSelectBook = `SELECT * FROM sanmiguel.books WHERE bookID = ?`;
                query = [bookID];
            } else if (author) {
                sqlSelectBook = "SELECT * FROM sanmiguel.books WHERE author LIKE ?";
                query = `%${author}%`;
            } else if (isbn) {
                sqlSelectBook = "SELECT * FROM sanmiguel.books WHERE isbn LIKE ?";
                query = `%${isbn}%`;
            } else if (title) {
                sqlSelectBook = "SELECT * FROM sanmiguel.books WHERE title LIKE ?";
                query = `%${title}%`;
            }
            connection.query(sqlSelectBook, query, async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                const data = results;
                if (data.length === 0) {
                    return res.status(404).send({
                        success: false,
                        messageErrBD: "No books found with the provided parameters",
                        swalTitle: "[ Query error ]",
                        errorMessage: "No books found with the provided parameters"
                    });
                }
                return res.status(200).send(data);
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getBook: async (req, res) => {
        try {
            const bookID = req.params.idBook || req.body.idBook;
            const sqlSelectBook = `SELECT * FROM books WHERE bookID = ?`;
            connection.query(sqlSelectBook, [bookID], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                const data = results[0];
                await redisClient.set(`book${bookID}`, JSON.stringify(data), async (err, reply) => {
                    await redisClient.expire(`book${bookID}`, 3600)
                    if (err) return console.error(err);
                    if (reply) res.status(200).send(data);
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    deliverBook: async (req, res) => {
        const bookID = req.params.idBook || req.body.idBook;
        const { bookingID, score, review, deliver_date_review, reviewOn } = req.body;
        const sql = [`UPDATE books SET 
                    reserved=0 WHERE bookID=${bookID}`,
        `UPDATE bookings SET delivered=1 WHERE bookingID=${bookingID}`,
        `INSERT INTO votes (bookID, bookingID, score, review, deliver_date_review, fullnamePartner, reviewOn) VALUES (${bookID}, ${bookingID}, ${score}, "${review}", "${deliver_date_review}", (SELECT CONCAT(p.lastname, ', ', p.name) AS fullName FROM bookings bk RIGHT JOIN partners p ON p.dni=bk.partnerDNI WHERE bookingID=${bookingID}), ${reviewOn})`];
        connection.query(
            sql.join(";"),
            async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                try {
                    await redisClient.del(`bookInfo${bookID}`);
                } catch (error) { }
                try {
                    await redisClient.del('books');
                } catch (error) { }
                try {
                    await redisClient.del(`review${bookID}`);
                } catch (error) { }
                try {
                    await redisClient.del(`bookings`);
                } catch (error) { }
                res.status(200).send({
                    success: true,
                    swalTitle: "[ Review added.... ]",
                    messageSuccess: `The following BOOK has been delivered with ID : ${bookID}, and a review has been added`
                });
            }
        );
    },
    existsCover: async (req, res, next) => {
        try {
            const bookID = req.body.idBook || req.params.idBook;
            const bucketName = config.BUCKET_NAME;
            const sqlSelect = "SELECT * FROM coverBooks WHERE bookID = ?";
            connection.query(sqlSelect, [bookID], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 1) {
                    const { objectName: nameCover, urlCover } = await saveImageServer(req, res);
                    const coverID = results[0].coverID;
                    try {
                        const nameColverOld = results[0].nameCover;
                        await driveClient.removeObject(bucketName, nameColverOld);
                    } catch (error) { }
                    sqlUpdateCover = `UPDATE coverBooks SET ? WHERE coverID = ${coverID}`;
                    connection.query(sqlUpdateCover, { bookID, nameCover }, async (_err, _results) => {
                        try {
                            await redisClient.del(`bookInfo${bookID}`);
                        } catch (error) { }
                        return res.status(200).send({
                            success: true,
                            exists: true,
                            nameCover,
                            urlCover,
                            swalTitle: "[ Cover update.... ]",
                            messageSuccess: `Cover updated successfully.`
                        });
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
    uploadFile: async (req, res) => {
        try {
            const bookID = req.body.idBook || req.params.idBook;
            const { objectName: nameCover, urlCover } = await saveImageServer(req, res);
            const sqlInsertCover = "INSERT INTO coverBooks SET ?";
            connection.query(sqlInsertCover, { bookID, nameCover }, async (err, _results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                try {
                    await redisClient.del(`bookInfo${bookID}`);
                } catch (error) { }
                return res.status(200).send({
                    success: true,
                    exists: false,
                    nameCover,
                    urlCover,
                    swalTitle: "[ Cover added.... ]",
                    messageSuccess: `Cover added successfully.`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    addBook: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(300).send({
                    success: false,
                    swalTitle: "[ Error validations ]",
                    msgValidation: errors.array()
                });
            }
            const {
                numReference,
                title,
                author,
                isbn,
                purchase_date,
                editorial,
                type,
                language,
                collection,
                observation
            } = req.body;
            const date = new Date();
            const lastUpdate = moment(date).format("YYYY-MM-DD HH:mm:ss");
            const fechaCompra = purchase_date ? purchase_date : null;
            const bookDataUpdate = [{
                numReference,
                title,
                author,
                isbn,
                purchase_date: fechaCompra,
                editorial,
                type,
                language,
                collection,
                observation,
                lastUpdate
            }];
            sqlInsertBooks = "INSERT INTO books SET ?";
            connection.query(sqlInsertBooks, bookDataUpdate, async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                try {
                    await redisClient.del('books');
                } catch (error) { }
                res.status(200).send({
                    success: true,
                    swalTitle: "Book added...",
                    messageSuccess: `The book data has been added correctly, with ID : ${results.insertId}`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    putBook: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(300).send({
                    success: false,
                    swalTitle: "[ Error Validation ]",
                    msgValidation: errors.array()
                });
            }
            const bookID = req.params.idBook;
            const {
                numReference,
                title,
                author,
                isbn,
                purchase_date,
                editorial,
                type,
                language,
                collection,
                observation
            } = req.body;
            const date = new Date();
            const lastUpdate = moment(date).format("YYYY-MM-DD HH:mm:ss");
            const sqlUpdateBook = `UPDATE books SET ? WHERE bookID = ${bookID}`;
            const fechaCompra = purchase_date ? purchase_date : null;
            const bookDataUpdate = [{
                numReference,
                title,
                author,
                isbn,
                purchase_date: fechaCompra,
                editorial,
                type,
                language,
                collection,
                observation,
                lastUpdate
            }];
            connection.query(sqlUpdateBook, bookDataUpdate, async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                try {
                    await redisClient.del(`book${bookID}`);
                } catch (error) { }
                try {
                    await redisClient.del(`bookInfo${bookID}`);
                } catch (error) { }
                try {
                    await redisClient.del('books');
                } catch (error) { }
                res.status(200).send({
                    success: true,
                    swalTitle: "Book updated...",
                    messageSuccess: `The book data has been updated correctly, with ID : ${bookID}`
                });
            })
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    activeReservePartner: async (req, res) => {
        try {
            const isbn = req.params.isbn;
            const sqlSelect = `SELECT b.*, p.dni as partnerDNI, p.partnerID as partnerID
                FROM books b 
                LEFT JOIN 
                bookings bk ON bk.bookID=b.bookID AND bk.delivered = 0
                LEFT JOIN 
                partners p ON p.dni=bk.partnerDni
                WHERE isbn=?;`;
            connection.query(sqlSelect, [isbn], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                const reserved = results[0].reserved;
                const partnerDNI = results[0].partnerDNI;
                console.log({ results })
                if (reserved === 1 && partnerDNI) {
                    return res.status(200).send({ results });
                } else {
                    return res.status(200).send({ results: null });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    deleteBook: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const bucketName = config.BUCKET_NAME;
            const sqlSelect = "SELECT title FROM books WHERE bookID=?";
            connection.query(sqlSelect, [bookID], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 0) {
                    try {
                        await redisClient.del(`books`);
                    } catch (error) { }
                    return res.status(403).send({
                        success: false,
                        exists: false,
                        swalTitle: "No found....!",
                        errorMessage: `[ ERROR ], The BOOK with ID : ${bookID} does not exist`
                    });
                }
                const title = results[0].title;
                const sqlSelectCovers = "SELECT * FROM coverBooks WHERE bookID=?";
                connection.query(sqlSelectCovers, [bookID], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            swalTitle: "[ ERROR DB ]",
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    try {
                        const nameColverOld = results[0].nameCover;
                        await driveClient.removeObject(bucketName, nameColverOld);
                    } catch (error) { }
                    const sqlDelete = "DELETE FROM books WHERE bookID=?";
                    connection.query(sqlDelete, [bookID], async (err, _results) => {
                        if (err) {
                            console.error("[ DB ]", err.sqlMessage);
                            return res.status(400).send({
                                success: false,
                                messageErrBD: err,
                                swalTitle: "[ ERROR DB ]",
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                        }
                        try {
                            await redisClient.del(`books`);
                        } catch (error) { }
                        res.status(200).send({
                            success: true,
                            swalTitle: "[ Book deleted... ]",
                            messageSuccess: `The Book with ID: '${bookID}', TITLE : '${title}' has been successfully deleted`
                        });
                    });
                })
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    infoReviews: async (req, res) => {
        try {
            const bookID = req.params.idBook || req.body.idBook;
            const selectReviews = "SELECT v.score, v.deliver_date_review as dateReview, v.review, fullnamePartner AS fullName, reviewOn FROM votes v WHERE v.bookID=?"; connection.query(selectReviews, [bookID], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 0) {
                    return res.status(200).send({
                        success: false,
                        swalTitle: "No found....!",
                        errorMessage: "[ ERROR ], No results found",
                        data: null
                    });
                }
                const data = results;
                await redisClient.set(`review${bookID}`, JSON.stringify(data), async (err, reply) => {
                    if (err) return console.error(err);
                    if (reply) {
                        await redisClient.expire(`review${bookID}`, 3600)
                        return res.status(200).send({
                            success: true,
                            swalTitle: "[ Success.... ]",
                            messageSuccess: "Success",
                            data
                        });
                    }
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getISBN: (req, res) => {
        try {
            const isbn = req.params.isbn;
            const sqlExistsISBN = "SELECT * FROM sanmiguel.books WHERE isbn LIKE ?";
            const query = `%${isbn}%`;
            connection.query(sqlExistsISBN, [query], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ ERROR DB ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 1) {
                    const data = results;
                    return res.status(200).send({
                        success: true,
                        swalTitle: "[ Exists.... ]",
                        successMessage: "The ISBN exists, and is associated with the following book",
                        data,
                    });
                }
                if (results.length >= 1) {
                    const data = results;
                    return res.status(200).send({
                        success: true,
                        swalTitle: "[ Exists.... ]",
                        successMessage: "The following books exist with the search parameter",
                        data,
                    });
                }
                if (results.length === 0) {
                    res.status(200).send({
                        success: false,
                    });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = bookController;

function generateCoverRand(length, type) {
    switch (type) {
        case 'num':
            characters = "0123456789";
            break;
        case 'alf':
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            break;
        case 'rand':
            break;
        default:
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            break;
    }
    var randNameCover = "";
    for (i = 0; i < length; i++) {
        if (type == 'rand') {
            randNameCover += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
        } else {
            randNameCover += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }
    return randNameCover;
}
async function saveImageServer(req, res) {
    try {
        const file = req.file;
        const bucketName = config.BUCKET_NAME;
        const proccessImage = sharp(file.buffer).resize(200, 322, {
            fit: 'cover',
            background: '#fff'
        });
        const resizeImageBuffer = await proccessImage.toBuffer();
        const objectName = generateCoverRand(15) + '.png';
        const putObjectPromise = new Promise((resolve, reject) => {
            driveClient.putObject(bucketName, objectName, resizeImageBuffer, (err, stat) => {
                if (err) {
                    console.error(err);
                    reject('Could not upload image');
                } else {
                    resolve(stat);
                }
            });
        });
        const presignedUrlPromise = new Promise((resolve, reject) => {
            const expirationTime = 5 * 24 * 60 * 60;
            driveClient.presignedGetObject(bucketName, objectName, expirationTime, (err, url) => {
                if (err) {
                    console.error(err);
                    reject('Could not get URL');
                } else {
                    resolve(encodeURIComponent(url));
                }
            });
        });
        const [stat, urlCover] = await Promise.all([putObjectPromise, presignedUrlPromise]);
        console.info(`Image ${objectName} has been uploaded successfully`);
        return { objectName, urlCover };
    } catch (error) {
        console.error(error);
        res.status(500).redirect("/");
    }
}
