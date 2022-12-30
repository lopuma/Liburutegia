const connection = require("../../../database/db");
const sharp = require('sharp');
const fs = require('fs')
const path = require('path');

const bookController = {
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
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 0) {
                    return res.status(404).send({
                        success: false,
                        exists: false,
                        errorMessage: `Error there is no book with ID BOOK: ${bookID}`
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
    getBooks: async (_req, res) => {
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
            const bookID = req.params.idBook;
            const sqlSelectBook = `SELECT b.*, FORMAT(AVG(v.score), 2) AS rating, COUNT(v.score) AS numVotes, SUM(v.score) AS totalScore, cb.nameCover as cover FROM votes v RIGHT JOIN books b ON b.bookID=v.bookID LEFT JOIN coverBooks cb ON cb.bookID=b.bookID WHERE b.bookID= ${bookID}`;
            await connection.query(sqlSelectBook, (err, results) => {
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
                        message: `Successfully found book with ID : ${results[0].bookID}`,
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
            bookID = req.params.bookID;
            title = req.body.title_book;
            author = req.body.author;
            type = req.body.type;
            language = req.body.language;
            let sql =
                "UPDATE books SET title = ?, author = ?, type = ?, language = ? WHERE bookID = ?";
            connection.query(sql, [title, author, type, language, bookID], function (
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
    // TODO ✅ ENTREGA BOOK
    deliverBook: async (req, res) => {
        const idBook = req.params.bookID;
        
        const { idBooking, score, review, deliver_date_review } = req.body;
        
        const sql = [`UPDATE books SET 
                    reserved=0 WHERE bookID=${idBook}`, 
                    `UPDATE bookings SET deliver=1 WHERE bookingID=${idBooking}`, 
                    "INSERT INTO votes SET ?"];

        await connection.query(
            sql.join(";"),
            {
                bookID: idBook,
                bookingID: idBooking,
                score,
                review,
                deliver_date_review
            },
            (err) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                res.status(200).send({
                    success: true,
                    messageSuccess: `The following BOOK has been delivered with ID : ${idBook}, and a review has been added`
                });
            }
        );
    },
    // TODO DELETE
    deleteBook: async (req, res) => {
        const idBook = req.params.idBook;
        sql = "DELETE FROM books WHERE bookID=?";
        connection.query(sql, [idBook], (err, _results) => {
            if (err) {
                throw err;
            }
            res.status(200).send({
                success: true,
                message: `The book with id ${idBook} has been successfully deleted`
            });
        });
    }, 
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
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 1) {
                    const nameCover = await saveImageServer(req, res);
                    const coverID = results[0].coverID ;
                    const bookID = idBook;
                    //TODO ELIMINAR IMAGEN ANTERIOR
                    try {
                        const nameColverOld = results[0].nameCover;
                        const pathCoverBooks = path.join(__dirname, '../../public/img/covers');
                        fs.unlinkSync(`${pathCoverBooks}/${nameColverOld}`);
                        console.log(`Imagen actualizada, y se ha elimninado la anterior imagen ${nameColverOld}, del libro ${idBook}.`);
                    } catch (error) { 
                        console.error(`No se ha eliminado la imagen, porque no existe, se procede a actualizar la imagen del libro ${idBook}.`);
                    }
                    //TODO ATUALIZA LA IMAGEN AL EXISTOR UN REGISTRO EN LA BD.
                    sqlUpdateCover = `UPDATE coverBooks SET ? WHERE coverID = ${coverID}`;
                    await connection.query(sqlUpdateCover, { bookID, nameCover }, (_err, _results) => {
                        return res.status(200).send({
                            success: true,
                            exists: true,
                            errorSucces: `Book ${idBook}, cover uploaded successfully`
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
                        code: 400,
                        message: err
                    });
                }
                return res.status(200).send({
                    success: true,
                    exists: false,
                    errorSucces: `Book ${idBook}, cover uploaded successfully`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
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
        return nameCover+'.png';
    } catch (error) {
        console.error(error);
        res.status(500).redirect("/");
    }
}
