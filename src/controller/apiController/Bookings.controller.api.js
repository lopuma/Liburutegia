const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db");
const flash = require("connect-flash");


const bookingController = {
    //TODO VALIDATIONS
    validate: [body("email", "The format email address is incorrect.").isEmail()],

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
            const sqlSelect = "SELECT * FROM bookings";
            await connection.query(sqlSelect, (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    });
                }
                if (results.length === 0) {
                    return res.status(200).send({
                        success: false,
                        messageNotFound: "No data found for Bookings"
                    });
                }
                res.status(200).send({
                    success: true,
                    messageSuccess: results.msg,
                    data: results
                });
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

    // TODO
    infoBooking: async (req, res) => {
        try {
            const idBooking = req.params.idBooking;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlBooking = "SELECT * FROM bookings WHERE bookingID = ?";
            const sqlBookin =
                "SELECT p.bookingID, p.dni, p.name, bk.bookingID, bk.bookID, b.isbn, b.title, b.author, b.reserved, bk.reservation_date, v.bookingID bookingID_review, v.score, v.review, v.deliver_date_review FROM bookings p LEFT OUTER JOIN bookings bk ON p.dni=bk.partnerDNI INNER JOIN books b ON bk.bookID=b.bookIDLEFT OUTER JOIN votes v ON bk.bookingID=v.bookingID WHERE p.dni = ?";
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
            const errors = validationResult(req);
            const {
                inputDni: dni,
                inputScanner: scanner,
                inputName: name,
                inputLastname: lastname,
                inputDirection: direction,
                inputPopulation: population,
                inputEmail: email,
                actualDate: date,
                idBookingFamily,
                dniFamily
            } = req.body;
            let phone1 = req.body.inputPhone;
            let phone2 = req.body.inputPhoneLandline;
            if (!dni || !name || !lastname) {
                return res.send({
                    status: 400,
                    exists: true,
                    errorMessage: `Missing data to complete, can not be empty`
                });
            }
            if (email !== "") {
                if (!errors.isEmpty()) {
                    req.flash("errorValidation", errors.array());
                    return res.send({
                        status: 304,
                        exists: false,
                        messageSuccess: errors.array()
                    });
                }
            }
            const phonea = phone1 ? parseInt(phone1) : null;
            const phoneb = phone2 ? parseInt(phone2) : null;
            if (idBookingFamily === "null" || dniFamily === "null") {
                await addNewBooking(
                    dni,
                    scanner,
                    name,
                    lastname,
                    direction,
                    population,
                    phonea,
                    phoneb,
                    email,
                    date
                );
            } else {
                const sqlInsertFamily = "INSERT INTO familys SET ?";
                await connection.query(
                    sqlInsertFamily,
                    {
                        dni,
                        id_familiar_booking: idBookingFamily
                    },
                    async err => {
                        if (err) {
                            console.error("[ DB ]", err.sqlMessage);
                            return res.status(400).send({
                                code: 400,
                                message: err
                            });
                        }
                        await addNewBooking(
                            dni,
                            scanner,
                            name,
                            lastname,
                            direction,
                            population,
                            phonea,
                            phoneb,
                            email,
                            date
                        );
                    }
                );
            }
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }

        async function addNewBooking(
            dni,
            scanner,
            name,
            lastname,
            direction,
            population,
            phonea,
            phoneb,
            email,
            date
        ) {
            const sqlInsert = "INSERT INTO bookings SET ?";
            await connection.query(
                sqlInsert,
                {
                    dni,
                    scanner,
                    name,
                    lastname,
                    direction,
                    population,
                    phone1: phonea,
                    phone2: phoneb,
                    email,
                    date
                },
                (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            code: 400,
                            message: err
                        });
                    }
                    req.flash(
                        "messageSuccess",
                        `Booking successfully created, with BOOKINGS ID : ${results.insertId}`
                    );
                    res.status(200).send({
                        success: true,
                        exists: false,
                        messageSuccess: `Booking successfully created, with BOOKINGS ID : ${results.insertId}`
                    });
                }
            );
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


