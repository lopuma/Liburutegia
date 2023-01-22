const connection = require("../../../database/db");
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
            .withMessage("This field `Author` is required")
    ],
    // TODO ✅ NO EXISTE ID BOOKS
    noExistBook: async (req, res, next) => {
        try {
            const bookID = req.params.idBook;
            const sqlSelect = "SELECT * FROM books WHERE bookID = ?";
            await connection.query(sqlSelect, [bookID], (err, results) => {
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
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ SHOW ALL BOOKS
    getBooks: async (_req, res) => {
        try {
            await connection.query("SELECT * FROM books", (err, results) => {
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
                res.status(200).send(data);
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    //TODO ✅ SHOW ONLY BOOKS FOR ID
    getBook: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const sqlSelectBook = `SELECT * FROM books WHERE bookID = ?`;
            await connection.query(sqlSelectBook, [bookID], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                console.log("ESTE RESULT DONDE SE MUESTRA ", results[0]);
                return res.status(200).send(results[0]);
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ ENTREGA BOOK
    deliverBook: async (req, res) => {
        const idBook = req.params.bookID;

        const { idBooking, score, review, deliver_date_review } = req.body;
        const sql = [`UPDATE books SET 
                    reserved=0 WHERE bookID=${idBook}`,
        `UPDATE bookings SET delivered=1 WHERE bookingID=${idBooking}`,
        `INSERT INTO votes (bookID, bookingID, score, review, deliver_date_review, fullnamePartner) VALUES (${idBook}, ${idBooking}, ${score}, "${review}", "${deliver_date_review}", (SELECT CONCAT(p.lastname, ', ', p.name) AS fullName FROM bookings bk RIGHT JOIN partners p ON p.dni=bk.partnerDNI WHERE bookingID=${idBooking}))`];
        await connection.query(
            sql.join(";"),
            (err) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                res.status(200).send({
                    success: true,
                    swalTitle: "[ Review added.... ]",
                    messageSuccess: `The following BOOK has been delivered with ID : ${idBook}, and a review has been added`
                });
            }
        );
    },
    // TODO ✅ SI EXISTE LA IMAGEN
    existsCover: async (req, res, next) => {
        try {
            const { idBook } = req.body;
            const sqlSelect = "SELECT * FROM coverBooks WHERE bookID = ?";
            await connection.query(sqlSelect, [idBook], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 1) {
                    const nameCover = await saveImageServer(req, res);
                    const coverID = results[0].coverID;
                    const bookID = idBook;
                    //TODO ELIMINAR IMAGEN ANTERIOR
                    try {
                        const nameColverOld = results[0].nameCover;
                        const pathCoverBooks = path.join(__dirname, '../../public/img/covers');
                        if (fs.existsSync(`${pathCoverBooks}/${nameColverOld}`)) {
                            fs.unlinkSync(`${pathCoverBooks}/${nameColverOld}`);
                            console.info(`Imagen actualizada, y se ha elimninado la anterior imagen ${nameColverOld}, del libro ${idBook}.`);
                        }
                    } catch (error) {
                        console.error(error);
                        res.status(500).redirect("/");
                    }
                    //TODO ATUALIZA LA IMAGEN AL EXISTOR UN REGISTRO EN LA BD.
                    sqlUpdateCover = `UPDATE coverBooks SET ? WHERE coverID = ${coverID}`;
                    await connection.query(sqlUpdateCover, { bookID, nameCover }, (_err, _results) => {
                        return res.status(200).send({
                            success: true,
                            exists: true,
                            nameCover,
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
    // TODO ✅ SUBIR IMAGEN
    uploadFile: async (req, res) => {
        try {
            const { idBook } = req.body;
            const nameCover = await saveImageServer(req, res);
            const sqlInsertCover = "INSERT INTO coverBooks SET ?";
            connection.query(sqlInsertCover, { bookID: idBook, nameCover }, (err, _results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                return res.status(200).send({
                    success: true,
                    exists: false,
                    nameCover,
                    swalTitle: "[ Cover added.... ]",
                    messageSuccess: `Cover added successfully.`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ ADD NEW BOOK
    addBook: async (req, res) => { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(300).send({
                    success: false,
                    swalTitle: "[ Error validation ]",
                    errorMessage: errors.array()
                });
            }
            const {
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
            await connection.query(sqlInsertBooks, bookDataUpdate, (err, results) => { 
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                res.status(200).send({
                    success: true,
                    swalTitle: "Book added...",
                    messageSuccess: `The book data has been added correctly, with ID : ${results.insertId }`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ ACTUALIZAR BOOK
    putBook: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(300).send({
                    success: false,
                    swalTitle: "[ Error Validation ]",
                    errorMessage: errors.array()
                });
            }
            const bookID = req.params.idBook;
            const {
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
            await connection.query(sqlUpdateBook, bookDataUpdate, (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
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
    // TODO ✅ DELETE BOOK
    deleteBook: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const sqlSelect = "SELECT title FROM books WHERE bookID=?";
            await connection.query(sqlSelect, [bookID], async (err, results) => {
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
                    return res.status(403).send({
                        success: false,
                        exists: false,
                        swalTitle: "No found....!",
                        errorMessage: `[ ERROR ], The BOOK with ID : ${bookID} does not exist`
                    });
                }
                const title = results[0].title;
                const sqlDelete = "DELETE FROM books WHERE bookID=?";
                await connection.query(sqlDelete, [bookID], (err, _results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            swalTitle: "[ Error BD ]",
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    res.status(200).send({
                        success: true,
                        swalTitle: "[ Book deleted... ]",
                        messageSuccess: `The Book with ID: '${bookID}', TITLE : '${title}' has been successfully deleted`
                    });
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ INFO REVIEW
    infoReviews: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const selectReviews = "SELECT v.score, v.deliver_date_review as dateReview, v.review, fullnamePartner AS fullName, reviewOn FROM votes v WHERE v.bookID=?"; await connection.query(selectReviews, [bookID], (err, results) => {
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
                        errorMessage: "[ ERROR ], No results found",
                        data: null
                    });
                }
                const data = results;
                res.status(200).send({
                    success: true,
                    swalTitle: "[ Success.... ]",
                    messageSuccess: "Success",
                    data
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = bookController;

// TODO ✅ GENERAR NOMBRE DEL COVER
    function generateCoverRand(length, type) {
        switch (type) {
            case 'num':
                characters = "0123456789";
                break;
            case 'alf':
                characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                break;
            case 'rand':
                //FOR ↓
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

// TODO ✅ GUARDAR COVER
    async function saveImageServer(req, res) {
        try {
            const file = req.file;
            const proccessImage = sharp(file.buffer).resize(200, 322, {
                fit: 'cover',
                background: '#fff'
            });
            const nameCover = generateCoverRand(15);
            const resizeImageBuffer = await proccessImage.toBuffer();
            const pathCoverBooks = path.join(__dirname, '../../public/img/covers');
            fs.writeFileSync(`${pathCoverBooks}/${nameCover}.png`, resizeImageBuffer);
            return nameCover + '.png';
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
