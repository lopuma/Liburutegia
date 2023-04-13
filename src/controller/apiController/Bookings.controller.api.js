const connection = require("../../../connections/database/db-connect");
const moment = require('moment');
let _CACHEBOOKING = false;
const redisClient = require("../../../connections/redis/redis-connect");
const bookingController = {
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
    redisBookings : async (req, res , next) => {
        const _cacheBookings = _CACHEBOOKING;
        if(_cacheBookings){
            return await redisClient.get('bookings', async (err, reply) => {
                if(reply) {
                    const data = await JSON.parse(reply);
                    return res.status(200).send(data);
                } 
                next();
            });
        }
        next();
    },
    redisBooking: async (req, res, next) => {
        const bookingID = req.params.idBooking || req.body.idBooking;
        await redisClient.get(`booking${bookingID}`, (err, reply) => {
            if(reply) {
                const data = JSON.parse(reply);
                return res.status(200).send(data);
            }
            next();
        });
    },
    getBookings: async (req, res) => {
        try {
            const sqlSelect = `select bk.bookingID, bk.bookID, b.title as title, b.isbn, bk.partnerDni, CONCAT(p.lastname, ", ", p.name) as fullname, p.partnerID, bk.reserveDate, bk.delivered, bk.cancelReserved, bk.cancelReason, v.score, v.review, v.deliver_date_review, v.reviewOn from bookings bk INNER JOIN partners p ON p.dni=bk.partnerDNI INNER JOIN books b ON b.bookID=bk.bookID LEFT JOIN votes v ON v.bookingID=bk.bookingID`;
            connection.query(sqlSelect, async (err, results) => {
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
                await redisClient.set("bookings", JSON.stringify(data), async (err, reply) => {
                    if (err) {
                        _CACHEBOOKING = false;
                        return console.error(err)
                    }
                    if(reply) 
                    await redisClient.expire(`bookings`, 3600)
                    {   
                        _CACHEBOOKING = true;
                        res.status(200).send(data);
                    }
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getBooking: async (req, res) => {
        try {
            const bookingID = req.params.idBooking;
            const sql = "SELECT * FROM bookings WHERE bookingID=?"
            connection.query(sql, [bookingID], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                const data = results[0];
                await redisClient.set(`booking${bookingID}`, JSON.stringify(data), async (err, reply) => {
                    if(reply) {
                        await redisClient.expire(`booking${bookingID}`, 3600)
                        return res.status(200).send(data);
                    }
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
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
                    connection.query(sqlReserveBook, dataReserve, async (err, results) => {
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
                            _CACHEBOOKING = false;
                            try {
                                await redisClient.del('bookings');
                            } catch (error) { }
                            try {
                                await redisClient.del(`bookInfo${bookID}`);
                            } catch (error) { }
                            try {
                                await redisClient.del('books');
                            } catch (error) { }
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
                try {
                    await redisClient.del('bookings');
                } catch (error) { }
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


