const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db");
const flash = require("connect-flash");


const bookingController = {
    //TODO EXISTS DNI BOOKINGS
    existBooking: async (req, res, next) => {
        try {
            const sqlSelect = "SELECT * FROM bookings WHERE dni = ?";
            const dni = req.body.inputDni;
            await connection.query(sqlSelect, [dni], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    });
                }
                if (results.length === 1) {
                    return res.status(404).send({
                        success: false,
                        exists: true,
                        errorMessage: `Booking DNI : ${dni} already exists with ID : ${results[0]
                            .bookingID}`
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

    //TODO NO EXISTE ID BOOKINGS
    noExistBooking: async (req, res, next) => {
        try {
            const bookingID = req.params.idBooking;
            const sqlSelect = "SELECT * FROM bookings WHERE bookingID = ?";
            await connection.query(sqlSelect, [bookingID], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    });
                }
                if (results.length === 0) {
                    return res.status(404).send({
                        success: false,
                        exists: false,
                        errorMessage: `Error there is no member with ID BOOKINGS : ${bookingID}`
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
            const sqlSelect = `select bk.bookingID, bk.bookID, b.title as title, bk.partnerDni, CONCAT(p.lastname, ", ", p.name) as fullname, bk.reserveDate, bk.delivered from bookings bk INNER JOIN partners p ON p.dni=bk.partnerDNI INNER JOIN books b ON b.bookID=bk.bookID`;
            await connection.query(sqlSelect, (err, results) => {
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

    //TODO SHOW ONLY BOOKINGS FOR ID
    getBooking: async (req, res) => {
        try {
            const bookingID = req.params.idBooking;
            const sqlSelect = "SELECT * FROM bookings WHERE bookingID=?";
            await connection.query(sqlSelect, [bookingID], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        success: false,
                        message: err
                    });
                }
                res.status(200).send(results[0]);
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // TODO ✅ ADD NEW BOOKINGS
    infoBooking: async (req, res) => {
        try {
            const idBooking = req.params.idBooking;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlBooking = "SELECT * FROM bookings WHERE bookingID = ?";
            const sqlBookin =
                "SELECT p.bookingID, p.dni, p.name, bk.bookingID, bk.bookID, b.isbn, b.title, b.author, b.reserved, bk.reserveDate, v.bookingID bookingID_review, v.score, v.review, v.deliver_date_review FROM bookings p LEFT OUTER JOIN bookings bk ON p.dni=bk.partnerDNI INNER JOIN books b ON bk.bookID=b.bookIDLEFT OUTER JOIN votes v ON bk.bookingID=v.bookingID WHERE p.dni = ?";
            await connection.query(sqlBooking, [idBooking], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    });
                }
                const dni = results[0].dni;
                //const sqlFamily = "SELECT * FROM familys f LEFT JOIN bookings p ON f.dni_familiar_booking=p.dni WHERE f.dni_family=?";
                await connection.query(sqlBookin, [dni], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            code: 400,
                            message: err
                        });
                    }
                    if (results.length === 0) {
                        return res.send({
                            success: false,
                            data: results,
                            errorMessage: `There is no data with that DNI: ${dni}, associated with the booking with id: ${idBooking}`
                        });
                    }
                    const data = results;
                    res.status(200).send(data);
                    // await connection.query(sqlFamily, [dni], async (err, results) => {
                    //     if (err) {
                    //         console.error("[ DB ]", err.sqlMessage);
                    //         return res
                    //             .status(400)
                    //             .send({
                    //                 code: 400,
                    //                 message: err
                    //             });
                    //     }
                    //     res.status(200).send({
                    //         data: resDataBookings,
                    //         info: results
                    //     });
                    // });
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // ADD BOOKINGS
    addBooking: async (req, res) => {
        try {
            const bookID = req.params.idBook;
            const { title, partnerID, partnerDni, reserveDate } = req.body;
            const selectReserve = `SELECT b.reserved as reserved, b.title as title, bk.partnerDNI as dni, CONCAT(p.lastname,", ", p.name) as fullname FROM books b INNER JOIN bookings bk ON bk.bookID=b.bookID INNER JOIN partners p on p.dni=bk.partnerDNI WHERE b.bookID = ${bookID} and bk.delivered=0`;
            await connection.query(selectReserve, async (err, results) => {
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
                await connection.query(selectExistDni, async (err, results) => {
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
                    //const selectExistBooking = `select * from bookings WHERE partnerDNI='${partnerDni}' AND bookID=${bookID}`;
                    //await connection.query(selectExistBooking, async (err, results) => {
                        /*if (err) {
                            console.error("DB", err.sqlMessage);
                            return res.status(400).send({
                                success: false,
                                messageErrBD: err,
                                swalTitle: "Error BD",
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                        }*/
                        /*if (results.length > 0) {
                            return res.status(200).send({
                                success: false,
                                swalTitle: "Data exists....!",
                                errorMessage: `The book with ID: '${bookID}', has a reservation to partner Dni: '${results[0].partnerDNI}'.`
                            });
                        }*/
                    const insertBooking = [
                        `UPDATE books SET reserved=if(reserved = 0, 1, 1) WHERE bookID=${bookID}`,
                        "INSERT INTO bookings SET ?"
                    ]
                    const dataReserve = {
                        bookID,
                        partnerDni,
                        reserveDate
                    }
                    await connection.query(insertBooking.join(";"), dataReserve, (err, results) => {
                        if (err) {
                            console.error("[ DB ]", err.sqlMessage);
                            return res.status(400).send({
                                success: false,
                                messageErrBD: err,
                                swalTitle: "Error BD",
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                        }
                        console.log("1 => ", results[1].insertId, "2 => ", results[0].insertId)
                        res.status(201).send({
                            success: true,
                            swalTitle: "Reserve Book added...",
                            messageSuccess:`Successfully reserved the Book with ID: ${bookID}, it has been created with Booking ID: ${results[1].insertId}, for the partner with Dni: ${partnerDni}
                            `
                        });
                    });
                    //});
                });
            });

        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // DELETE BOOKINGS
    deleteBooking: async (req, res) => {
        try {
            const bookingID = req.params.idBooking;
            deleteBookins = [
                `DELETE bookings FROM bookings JOIN bookings ON bookings.dni = bookings.partnerDNI WHERE bookings.bookingID = ${bookingID}`,
                `DELETE FROM bookings WHERE bookingID =  ${bookingID}`
            ];
            await connection.query(deleteBookins.join(";"), async (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash(
                    "messageUpdate",
                    `Booking successfully delete, with BOOKINGS ID : ${bookingID}`
                );
                return res.redirect("/workspace/bookings");
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    // UDATE BOOKINGS FOR ID
    putBooking: async (req, res) => {
        try {
            const errors = validationResult(req);
            const bookingID = req.params.idBooking;
            const booking = ({
                dni,
                scanner,
                name,
                lastname,
                direction,
                population,
                phone1,
                phone2,
                email
            } = req.body);
            const sql = "UPDATE bookings SET ? WHERE bookingID = ?";
            await connection.query(sql, [booking, bookingID], (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash(
                    "messageUpdate",
                    `Booking successfully update, with BOOKINGS ID : ${bookingID}`
                );
                res.send({
                    success: true,
                    messageUpdate: `Booking successfully update, with BOOKINGS ID : ${bookingID}`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = bookingController;


