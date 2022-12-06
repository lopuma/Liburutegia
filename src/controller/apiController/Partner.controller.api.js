const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db");
const flash = require("connect-flash");
const { data } = require("jquery");

const partnerController = {
    //TODO VALIDATIONS
    validate: [body("email", "The format email address is incorrect.").isEmail()],
    //TODO EXISTS DNI PARTENER
    existPartner: async (req, res, next) => {
        try {
            const sqlSelect = "SELECT * FROM partners WHERE dni = ?";
            const dni = req.body.inputDni;
            await connection.query(
                sqlSelect,
                [dni],
                (err, results) => {
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
                            errorMessage: `Partner DNI : ${dni} already exists with ID : ${results[0]
                                .id_partner}`
                        });
                    } else {
                        next();
                    }
                }
            );
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    //TODO NO EXISTE ID PARTNER
    noExistPartner: async (req, res, next) => {
        try {
            const id_partner = req.params.idPartner;
            const sqlSelect = "SELECT * FROM partners WHERE id_partner = ?";
            await connection.query(
                sqlSelect,
                [id_partner],
                (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res
                            .status(400)
                            .send({
                                code: 400,
                                message: err
                            });
                    }
                    if (results.length === 0) {
                        return res
                            .status(404)
                            .send({
                                success: false,
                                exists: false,
                                errorMessage: `Error there is no member with ID PARTNER : ${id_partner}`
                            });
                    } else {
                        next();
                    }
                }
            );
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    //TODO SHOW ALL PARTNERS
    getPartners: async (req, res) => {
        try {
            const sqlSelect = "SELECT * FROM partners"
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
                        success: true,
                        messageNotFound: "No data found for Partners"
                    });
                }
                res.status(200).send({
                    success: "True",
                    messageSuccess: results.msg,
                    data: results,
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    //TODO SHOW ONLY PARTNER FOR ID
    getPartner: async (req, res) => {
        try {
            const id_partner = req.params.idPartner;
            const sqlSelect = "SELECT * FROM partners WHERE id_partner=?";
            await connection.query(sqlSelect, [id_partner], (err, results) => {
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
    infoPartner: async (req, res) => {
        try {
            const idPartner = req.params.idPartner;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlPartner = "SELECT * FROM partners WHERE id_partner = ?";
            const sqlBookin = "SELECT p.id_partner, p.dni, p.name, bk.id_booking, bk.book_id, b.isbn, b.title, b.author, b.reserved, bk.reservation_date, v.id_booking id_booking_review, v.score, v.review, v.deliver_date_review FROM partners p LEFT OUTER JOIN bookings bk ON p.dni=bk.partner_dni INNER JOIN books b ON bk.book_id=b.id_book LEFT OUTER JOIN votes v ON bk.id_booking=v.id_booking WHERE p.dni = ?";
            await connection.query(sqlPartner, [idPartner], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res
                        .status(400)
                        .send({
                            code: 400,
                            message: err
                        });
                }
                const dni = results[0].dni;
                //const sqlFamily = "SELECT * FROM familys f LEFT JOIN partners p ON f.dni_familiar_partner=p.dni WHERE f.dni_family=?";
                await connection.query(sqlBookin, [dni], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res
                            .status(
                                400
                            )
                            .send(
                                {
                                    code: 400,
                                    message: err
                                }
                            );
                    }
                    if (results.length === 0) {
                        return res.send(
                            {
                                success: false,
                                data: results,
                                errorMessage: `There is no data with that DNI: ${dni}, associated with the partner with id: ${idPartner}`
                            }
                        );
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
    // ADD PARTNERS
    addPartner: async (req, res) => {
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
                idPartnerFamily,
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
            if (idPartnerFamily === 'null' || dniFamily === 'null') {
                await addNewPartner(dni, scanner, name, lastname, direction, population, phonea, phoneb, email, date);
            } else {
                const sqlInsertFamily = "INSERT INTO familys SET ?";
                await connection.query(sqlInsertFamily, {
                    dni,
                    id_familiar_partner: idPartnerFamily,
                }, async (err) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res
                            .status(400)
                            .send({
                                code: 400,
                                message: err
                            });
                    }
                    await addNewPartner(dni, scanner, name, lastname, direction, population, phonea, phoneb, email, date);
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }

        async function addNewPartner(dni, scanner, name, lastname, direction, population, phonea, phoneb, email, date) {
            const sqlInsert = "INSERT INTO partners SET ?";
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
                        `Partner successfully created, with PARTNER ID : ${results.insertId}`
                    );
                    res.send({
                        status: 200,
                        exists: false,
                        messageSuccess: `Partner successfully created, with PARTNER ID : ${results.insertId}`
                    });
                }
            );
        }
    },
    // DELETE PARTNER
    deletePartner: async (req, res) => {
        try {
            const id_partner = req.params.idPartner;
            deleteBookins = [
                `DELETE bookings FROM bookings JOIN partners ON partners.dni = bookings.partner_dni WHERE partners.id_partner = ${id_partner}`,
                `DELETE FROM partners WHERE id_partner =  ${id_partner}`
            ];
            await connection.query(deleteBookins.join(";"), async (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash(
                    "messageUpdate",
                    `Partner successfully delete, with PARTNER ID : ${id_partner}`
                );
                return res.redirect("/workspace/partners");
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // UDATE PARTNER FOR ID
    putPartner: async (req, res) => {
        try {
            const errors = validationResult(req);
            const id_partner = req.params.idPartner;
            const partner = ({
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
            const sql = "UPDATE partners SET ? WHERE id_partner = ?";
            await connection.query(sql, [partner, id_partner], (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash(
                    "messageUpdate",
                    `Partner successfully update, with PARTNER ID : ${id_partner}`
                );
                res.send({
                    success: true,
                    messageUpdate: `Partner successfully update, with PARTNER ID : ${id_partner}`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = partnerController;
