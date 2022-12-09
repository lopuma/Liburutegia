const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db");
const flash = require("connect-flash");

const partnerController = {
    //TODO VALIDATIONS
    validate: [
        body("inputDni")
            .trim()
            .not()
            .isEmpty()
            .withMessage("this field is required"),
        // body("inputEmail")
        //     .trim()
        //     .isEmail()
        //     .withMessage("please enter a valid email address"),
        body("inputName")
            .trim()
            .not()
            .isEmpty()
            .withMessage("this field is required")
            .isString()
            .withMessage("please enter only letters")
            .isLength({ min: 4, max: 40 })
            .withMessage(
                "Full Name must have 4 to 40 digits and can contain letters, accents and spaces, cannot contain special characters."
            ),
        body("inputLastname")
            .trim()
            .not()
            .isEmpty()
            .withMessage("this field is required")
            .isString()
            .withMessage("please enter only letters")
            .isLength({ min: 4, max: 40 })
            .withMessage(
                "Full Name must have 4 to 40 digits and can contain letters, accents and spaces, cannot contain special characters."
            )
        // body("inputPhone")
        //     .trim()
        //     .isInt()
        //     .withMessage("please enter numbers")
        //     .isLength({ min: 7, max: 15 })
        //     .withMessage(
        //         "phoneNumber can not be less than 7 and must be more than 15"
        //     )
        // body( 'subscribed' ).isBoolean().withMessage
        // ('please enter a true or false value'),
        // body( 'occupation' ).trim().isIn(['employed','self-employed','enterpreneur']).WhitMessage
        // ('you must have something doing')
    ],

    //TODO ✅ EXISTS DNI PARTNERS
    existPartner: async (req, res, next) => {
        try {
            const sqlSelect = "SELECT * FROM partners WHERE dni = ?";
            const dni = req.body.inputDni;
            await connection.query(sqlSelect, [dni], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 1) {
                    return res.status(403).send({
                        success: false,
                        exists: true,
                        errorMessage: `Partner DNI : ${dni} already exists with ID : ${results[0]
                            .partnerID}`
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

    //TODO ✅ NO EXISTE ID PARTNERS
    noExistPartner: async (req, res, next) => {
        try {
            const partnerID = req.params.idPartner;
            if (
                partnerID === null ||
                partnerID === "null" ||
                partnerID === undefined ||
                partnerID === ""
            ) {
                next();
            } else {
                const sqlSelect = "SELECT * FROM partners WHERE partnerID = ?";
                await connection.query(sqlSelect, [partnerID], (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    if (results.length === 0) {
                        return res.status(403).send({
                            success: false,
                            exists: false,
                            errorMessage: `[ ERROR ], The partner with ID : ${partnerID} does not exist`
                        });
                    } else {
                        next();
                    }
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    //TODO ✅ SHOW ALL PARTNERS
    getPartners: async (req, res) => {
        try {
            const sqlSelect = "SELECT * FROM partners";
            await connection.query(sqlSelect, (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 0) {
                    return res.status(200).send({
                        success: false,
                        messageNotFound:
                            "There are no data in the table partners, Liburutegia.",
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

    //TODO SHOW ONLY PARTNERS FOR ID
    getPartner: async (req, res) => {
        try {
            const partnerID = req.params.idPartner;
            const sqlSelect = "SELECT * FROM partners WHERE partnerID=?";
            await connection.query(sqlSelect, [partnerID], (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                res.status(200).send(results[0]);
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

    //TODO ✅ INFO DE RESERVAS ACTIVAS
    infoPartner: async (req, res) => {
        try {
            const idPartner = req.params.idPartner;
            const sqlPartner = "SELECT * FROM partners WHERE partnerID = ?";
            await connection.query(sqlPartner, [idPartner], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                const sqlBookin = "SELECT p.partnerID, p.dni, p.name, bk.id_booking, bk.book_id, b.isbn, b.title, b.author, b.reserved, bk.reservation_date, v.id_booking id_booking_review, v.score, v.review, v.deliver_date_review FROM partners p LEFT OUTER JOIN bookings bk ON p.dni=bk.partner_dni INNER JOIN books b ON bk.book_id=b.id_book LEFT OUTER JOIN votes v ON bk.id_booking=v.id_booking WHERE p.dni = ?";
                const dni = results[0].dni;
                await connection.query(sqlBookin, [dni], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    if (results.length === 0) {
                        return res.send({
                            success: false,
                            data: results,
                            errorMessage: `There is no data with that DNI: ${dni}, associated with the partner with id: ${idPartner}`
                        });
                    }
                    const data = results;
                    res
                        .status(200)
                        .send({
                            success: true,
                            data,
                            messageSuccess: `Success`
                        });
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ ADD PARTNERS
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
                dniFamily,
                inputPhone: phone1,
                inputPhoneLandline: phone2
            } = req.body;
            // if (!dni || !name || !lastname) {
            //     return res.status(400).send({
            //         success: false,
            //         errorMessage: `Missing data to complete, can not be empty`
            //     });
            // }
            if (!errors.isEmpty()) {
                return res.status(300).send({
                    success: false,
                    errorMessage: errors.array()
                });
            }
            if (email !== "" || email !== null) {
                if (!errors.isEmpty()) {
                    return res.status(300).send({
                        success: false,
                        errorMessage: errors.array()
                    });
                }
            }

            let phonea = phone1 ? parseInt(phone1) : null;
            let phoneb = phone2 ? parseInt(phone2) : null;
            let activeFamily = 0;

            let dataAddPartner = [
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
                    date,
                    activeFamily
                }
            ];
            if (
                dniFamily === null ||
                idPartnerFamily === null ||
                dniFamily === "null" ||
                idPartnerFamily === "null" ||
                dniFamily === "" ||
                idPartnerFamily === "" ||
                dniFamily === undefined ||
                idPartnerFamily === undefined
            ) {
                const updatedDataAddPartner = dataAddPartner.map(data => ({
                    ...data,
                    activeFamily: 0
                }));
                await addNewPartner(updatedDataAddPartner);
            } else {
                const sqlInsertFamily = "INSERT INTO familys SET ?";
                await connection.query(
                    sqlInsertFamily,
                    {
                        familyDni: dni,
                        partnerDNI: dniFamily,
                        partnerID: idPartnerFamily
                    },
                    async err => {
                        if (err) {
                            console.error("[ DB ]", err.sqlMessage);
                            return res.status(400).send({
                                succes: false,
                                messageErrBD: err,
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                        }
                        const updatedDataAddPartner = dataAddPartner.map(data => ({
                            ...data,
                            activeFamily: 1
                        }));
                        await addNewPartner(updatedDataAddPartner);
                    }
                );
            }
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }

        async function addNewPartner(addPartner) {
            const sqlInsert = "INSERT INTO partners SET ?";
            await connection.query(sqlInsert, addPartner, (err, results) => {
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
                    messageSuccess: `Partner successfully created, with PARTNERS ID : ${results.insertId}`
                });
            });
        }
    },
    // DELETE PARTNERS
    deletePartner: async (req, res) => {
        try {
            const partnerID = req.params.idPartner;
            deleteBookins = [
                `DELETE bookings FROM bookings JOIN partners ON partners.dni = bookings.partner_dni WHERE partners.partnerID = ${partnerID}`,
                `DELETE FROM partners WHERE partnerID =  ${partnerID}`
            ];
            await connection.query(deleteBookins.join(";"), async (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash(
                    "messageUpdate",
                    `Partner successfully delete, with PARTNERS ID : ${partnerID}`
                );
                return res.redirect("/workspace/partners");
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // UDATE PARTNERS FOR ID
    putPartner: async (req, res) => {
        try {
            const errors = validationResult(req);
            const partnerID = req.params.idPartner;
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
            const sql = "UPDATE partners SET ? WHERE partnerID = ?";
            await connection.query(sql, [partner, partnerID], (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash(
                    "messageUpdate",
                    `Partner successfully update, with PARTNERS ID : ${partnerID}`
                );
                res.send({
                    success: true,
                    messageUpdate: `Partner successfully update, with PARTNERS ID : ${partnerID}`
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = partnerController;
