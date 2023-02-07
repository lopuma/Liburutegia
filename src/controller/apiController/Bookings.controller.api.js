const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db-connect");
const flash = require("connect-flash");
const moment = require('moment');

const bookingController = {

    //TODO ✅ EXISTS BOOKINGS EN VOTES, ESTO CUANDO LA RESERVA SE HA ENTREGADO
    existBooking: async (req, res, next) => {
        try {
            const bookingID = req.params.idBooking || req.body.bookingID;
            const bookID = req.params.idBook || req.body.bookID;
            const sqlSelect = `SELECT * FROM votes WHERE bookingID = ${bookingID}`;
            connection.query(sqlSelect, (err, results) => {
                if (err) {
                    console.error("[ DB - ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 1) {
                    return res.status(200).send({
                        success: false,
                        swalTitle: "[ Not found....! ]",
                        errorMessage: `The book with ID : ${bookID}, has already been delivered, reservation ID: ${bookingID}, The changes have not been saved, please check the reservation HISTORY.`
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
    noExistBooking: async (req, res, next) => {
        try {
            const bookingID = req.params.idBooking || req.body.bookingID;
            const sqlSelect = "SELECT * FROM bookings WHERE bookingID = ?";
            connection.query(sqlSelect, bookingID, (err, results) => {
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
                        swalTitle: "[ Not found....! ]",
                        errorMessage: `There is no booking with that ID : ${bookingID}`
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
    //TODO ✅ SHOW ALL BOOKINGS
    getBookings: async (req, res) => {
        try {
            const sqlSelect = `select bk.bookingID, bk.bookID, b.title as title, b.isbb, bk.partnerDni, CONCAT(p.lastname, ", ", p.name) as fullname, p.partnerID, bk.reserveDate, bk.delivered, bk.cancelReserved, bk.cancelReason, v.score, v.review, v.deliver_date_review, v.reviewOn from bookings bk INNER JOIN partners p ON p.dni=bk.partnerDNI INNER JOIN books b ON b.bookID=bk.bookID LEFT JOIN votes v ON v.bookingID=bk.bookingID`;
            connection.query(sqlSelect, (err, results) => {
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
                            "[ ERROR ], There are no data in the table bookings, Liburutegia.",
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
    //TODO ✅ SHOW ONLY BOOKINGS FOR ID
    getBooking: async (req, res) => {
        try {
            const bookingID = req.params.idBooking;
            const sql = "SELECT * FROM bookings WHERE bookingID=?"
            connection.query(sql, [bookingID], function (err, results) {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                return res.status(200).send(results[0]);
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ ADD BOOKINGS
    addBooking: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const { title, partnerID, partnerDni, reserveDate } = req.body;
            const selectReserve = `SELECT b.reserved as reserved, b.title as title, bk.partnerDNI as dni, CONCAT(p.lastname,", ", p.name) as fullname FROM books b INNER JOIN bookings bk ON bk.bookID=b.bookID INNER JOIN partners p on p.dni=bk.partnerDNI WHERE b.bookID = ${bookID} and bk.delivered=0`;
            connection.query(selectReserve, async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "Error BD",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                try {
                    if (results[0].reserved === 1) {
                        return res.status(200).send({
                            success: false,
                            swalTitle: "Data exists....!",
                            errorMessage: `The book with ID: '${bookID}' - '${results[0].title}', has a reservation to partner Dni: '${results[0].dni}' - '${results[0].fullname}'.`
                        });
                    }
                } catch (error) { }
                const selectExistDni = `SELECT dni FROM partners WHERE dni='${partnerDni}'`;
                connection.query(selectExistDni, async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            swalTitle: "Error BD",
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    if (results.length === 0) {
                        return res.status(200).send({
                            success: false,
                            swalTitle: "Data no exists....!",
                            errorMessage: `The member's DNI : ${partnerDni} does not exist in the database`
                        });
                    }
                    const dataReserve = {
                        bookID,
                        partnerDni,
                        reserveDate,
                    };
                    const sqlReserveBook = `UPDATE books SET reserved=1 WHERE bookID='${bookID}'; INSERT INTO bookings SET ?`;
                    connection.query(sqlReserveBook, dataReserve, (err, results) => {
                        try {
                            if (err) {
                                console.error("[ DB ]", err.sqlMessage);
                                return res.status(400).send({
                                    success: false,
                                    messageErrBD: err,
                                    swalTitle: "Error BD",
                                    errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                });
                            }
                            res.status(201).send({
                                success: true,
                                swalTitle: "Reserve Book added...",
                                messageSuccess: `Successfully reserved the Book with ID: ${bookID}, it has been created with Booking ID: ${results[1].insertId}, for the partner with Dni: ${partnerDni}
                                `
                            });
                        } catch (error) { }
                    });
                });
            });

        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    //TODO ✅ DELETE BOOKINGS
    cancelBooking: async (req, res) => {
        try {
            const bookID = req.params.idBook || req.body.bookID;
            const { bookingID, cancelReason } = req.body;
            const date = new Date();
            const deliver_date_review = moment(date).format("YYYY-MM-DD HH:mm:ss");
            cancelBooking = [
                `UPDATE books SET reserved=0 WHERE bookID=${bookID}`,
                `INSERT INTO votes (bookID, bookingID, score, review, deliver_date_review, fullnamePartner, reviewOn) VALUES (${bookID}, ${bookingID}, 0, "", "${deliver_date_review}", (SELECT CONCAT(p.lastname, ', ', p.name) AS fullName FROM bookings bk RIGHT JOIN partners p ON p.dni=bk.partnerDNI WHERE bookingID=${bookingID}), 0)`,
                `UPDATE bookings SET delivered=1, cancelReserved=1, cancelReason =? WHERE bookingID=${bookingID}`
            ];
            connection.query(cancelBooking.join(";"), cancelReason, async (err, results) => {
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
                    swalTitle: "[ Cancel booking....! ]",
                    messageSuccess: `Reservation canceled with ID : ${bookingID}`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

};

module.exports = bookingController;


