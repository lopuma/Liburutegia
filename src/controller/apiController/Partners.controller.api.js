const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db");
const flash = require("connect-flash");

const partnerController = {
    //TODO ✅ VALIDATIONS
    validate: [
        body("dni")
            .trim()
            .not()
            .isEmpty()
            .withMessage("This field `dni` is required"),
        body("name")
            .trim()
            .not()
            .isEmpty()
            .withMessage("This field `name` is required")
            .isString()
            .withMessage("please enter only letters")
            .isLength({ min: 4, max: 40 })
            .withMessage(
                "The Names field must have from 4 to 40 digits and can contain letters, accents and spaces, it cannot contain special characters or numbers."
            ),
        body("lastname")
            .trim()
            .not()
            .isEmpty()
            .withMessage("This field `lastname` is required")
            .isString()
            .withMessage("please enter only letters")
            .isLength({ min: 4, max: 40 })
            .withMessage(
                "The Last Name field It must have from 4 to 40 digits and can contain letters, accents and spaces, it cannot contain special characters or numbers."
            )
    ],
    //TODO ✅ EXISTS DNI PARTNERS
    existPartner: async (req, res, next) => {
        try {
            const sqlSelect = "SELECT * FROM partners WHERE dni = ?";
            const dni = req.body.dni;
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
    // TODO ✅ NO EXISTE ID PARTNERS
    noExistPartner: async (req, res, next) => {
        try {
            const partnerID = req.params.idPartner;
            if (
                partnerID === null ||
                partnerID === "null" ||
                partnerID === undefined ||
                partnerID === 'undefined' ||
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
    //TODO ✅ SHOW ONLY PARTNERS FOR ID
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
                return res.status(200).send(results[0]);
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
                const sqlBookin =
                    "SELECT p.partnerID, p.dni, p.name, bk.bookingID, bk.bookID, b.isbn, b.title, b.author, b.reserved, bk.reserveDate, v.bookingID bookingID_review, v.score, v.review, v.deliver_date_review FROM partners p LEFT OUTER JOIN bookings bk ON p.dni=bk.partnerDNI INNER JOIN books b ON bk.bookID=b.bookID LEFT OUTER JOIN votes v ON bk.bookingID=v.bookingID WHERE p.dni = ?";
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
                        return res.status(200).send({
                            success: false,
                            data: results,
                            errorMessage: `There is no data with that DNI: ${dni}, associated with the partner with id: ${idPartner}`
                        });
                    }
                    const data = results; 
                    console.log("[ DB ]", data);
                    res.status(200).send({
                        success: true,
                        data
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
            let {
                dni,
                scanner,
                name,
                lastname,
                direction,
                population,
                email,
                date,
                updateDate,
                partnerIDFamily,
                partnerDniFamily,
                phone1,
                phone2
            } = req.body;
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
                    updateDate,
                    activeFamily
                }
            ];
            if (
                partnerDniFamily === null ||
                partnerIDFamily === null ||
                partnerDniFamily === "null" ||
                partnerIDFamily === "null" ||
                partnerDniFamily === "" ||
                partnerIDFamily === "" ||
                partnerDniFamily === undefined ||
                partnerIDFamily === undefined
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
                        partnerID: partnerIDFamily,
                        partnerDni: partnerDniFamily,
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
    // TODO ✅ DELETE PARTNERS
    deletePartner: async (req, res) => {
        try {
            const partnerID = req.params.idPartner;
            var dniPartner = "";
            var dniFamily = "";
            // Obtiene el dni del partner a ELIMINAR
            const sqlDniPartner = `SELECT dni FROM partners WHERE partnerID = ${partnerID}`;
            await connection.query(sqlDniPartner, async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                dniPartner = results[0].dni;
                //Obtiene el dni de los familiares que tenia asignado
                const sqlDniFamily = 'SELECT f.familyDni as familyDni FROM familys f INNER JOIN partners p ON p.dni=f.partnerDni WHERE p.dni=?';
                await connection.query(sqlDniFamily, dniPartner, async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    //UPDATE ACTIVE FAMILY SI NO TIENE MAS RELACION
                    if (results.length === 1) {
                        dniFamily = results[0].familyDni;
                        const sqlExistFamily = "SELECT * FROM familys WHERE familyDni=?";
                        connection.query(sqlExistFamily, dniFamily, async (err, results) => {
                            if (err) {
                                console.error("[ DB ]", err.sqlMessage);
                                return res.status(400).send({
                                    success: false,
                                    messageErrBD: err,
                                    errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                });
                            };
                            if (results.length === 0){
                                const sqlActiveFamily = "UPDATE partners SET activeFamily=0 WHERE dni=?";
                                await connection.query(sqlActiveFamily, dniFamily, (err, results) => {
                                    if (err) {
                                        console.error("[ DB ]", err.sqlMessage);
                                        return res.status(400).send({
                                            success: false,
                                            messageErrBD: err,
                                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                        });
                                    };
                                });
                            };
                        });
                    };
                    //UPDATE ACTIVE FAMILY SI NO TIENE MAS RELACION
                    if (results.length >= 2) {
                        dniFamily = results[0].familyDni;
                        let dataFamilys = results;                        
                        dataFamilys.forEach(async (element) => {
                            const sqlExistFamily = "SELECT * FROM familys WHERE familyDni=?";
                            await connection.query(sqlExistFamily, element.familyDni, async (err, results) => {
                                if (err) {
                                    console.error("[ DB ]", err.sqlMessage);
                                    return res.status(400).send({
                                        success: false,
                                        messageErrBD: err,
                                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                    });
                                };
                                if (results.length === 0){
                                    const sqlActiveFamily = "UPDATE partners SET activeFamily=0 WHERE dni=?";
                                    await connection.query(sqlActiveFamily, element.familyDni, (err, results) => {
                                        if (err) {
                                            console.error("[ DB ]", err.sqlMessage);
                                            return res.status(400).send({
                                                success: false,
                                                messageErrBD: err,
                                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    };
                });
                const sqlDeletePartner = `DELETE FROM partners WHERE partnerID = ${partnerID}`;
                await connection.query(sqlDeletePartner, async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    return res.status(200).send({
                        succes: true,
                        messageSuccess: `The partner has been REMOVED, with ID: ${partnerID}`
                    });
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    // TODO ✅ UDATE PARTNERS FOR ID
    putPartner: async (req, res) => {
        try {
            const errors = validationResult(req);
            const idPartner = req.params.idPartner;
            const sqlUpdate = `UPDATE partners SET ? WHERE partnerID = ${idPartner}`;
            const {
                dni,
                scanner,
                name,
                lastname,
                direction,
                population,
                email,
                date,
                updateDate,
                partnerIDFamily,
                partnerDniFamily,
                phone1,
                phone2
            } = req.body[0];

            let phonea = phone1 ? parseInt(phone1) : null;
            let phoneb = phone2 ? parseInt(phone2) : null;

            let activeFamily = 0;
            
            let partnerDataUpdate = [{
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
                updateDate
            }];            
            if (
                partnerDniFamily === null ||
                partnerIDFamily === null ||
                partnerDniFamily === "null" ||
                partnerIDFamily === "null" ||
                partnerDniFamily === "" ||
                partnerIDFamily === "" ||
                partnerDniFamily === undefined ||
                partnerIDFamily === undefined
            ) {
                const updatedDataAddPartner = partnerDataUpdate.map(data => ({
                    ...data,
                    activeFamily: 0
                }));
                if (updatedDataAddPartner[0].activeFamily === 0) {
                    const sqlDeleteFamily = " DELETE FROM familys WHERE familyDni=? AND partnerDni=?";
                    await connection.query(sqlDeleteFamily, [dni, partnerDniFamily], async (err, results) => {
                        if (err) {
                            console.error("[ DB ]", err.sqlMessage);
                            return res.status(400).send({
                                success: false,
                                messageErrBD: err,
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                        }
                        const sqlOtherFamily = "SELECT * FROM familys WHERE familyDni=?";
                        await connection.query(sqlOtherFamily, dni, async (err, results) => {
                            if (err) {
                                console.error("[ DB ]", err.sqlMessage);
                                return res.status(400).send({
                                    success: false,
                                    messageErrBD: err,
                                    errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                });
                            }
                            if (results.length !== 0) {
                                const sqlActiveFamily = "UPDATE partners SET activeFamily=1 WHERE dni=?";
                                await connection.query(sqlActiveFamily, dni, (err, results) => {
                                    if (err) {
                                        console.error("[ DB ]", err.sqlMessage);
                                        return res.status(400).send({
                                            success: false,
                                            messageErrBD: err,
                                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
                await connection.query(sqlUpdate, updatedDataAddPartner, (err, results) => {
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
                        messageSuccess: `Partner successfully UPDATE, with PARTNERS ID : ${idPartner}`
                    });
                });
            } else {
                const sqlExistsFamily = "SELECT * from familys WHERE familyDni=? AND partnerDni=?";
                await connection.query(
                    sqlExistsFamily, [dni, partnerDniFamily], async (err, exists) => {
                        if (err) {
                            console.error("[ DB ]", err.sqlMessage);
                            return res.status(400).send({
                                success: false,
                                messageErrBD: err,
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                        }
                        if (exists.length === 0) {
                            const sqlInsertFamily = "INSERT INTO familys SET ?";
                            await connection.query(
                                sqlInsertFamily,
                                {
                                    familyDni: dni,
                                    partnerDni: partnerDniFamily,
                                    partnerID: partnerIDFamily
                                },
                                async (err) => {
                                    if (err) {
                                        console.error("[ DB ]", err.sqlMessage);
                                        return res.status(400).send({
                                            succes: false,
                                            messageErrBD: err,
                                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                        });
                                    }
                                }
                            );
                        }
                        const updatedDataPartner = partnerDataUpdate.map(data => ({
                            ...data,
                            activeFamily: 1
                        }));
                        await connection.query(sqlUpdate, updatedDataPartner, (err, results) => {
                            if (err) {
                                console.error("[ DB ?]", err.sqlMessage);
                                return res.status(400).send({
                                    success: false,
                                    messageErrBD: err,
                                    errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                });
                            }
                            res.status(200).send({
                                success: true,
                                messageSuccess: `Partner successfully UPDATE, with PARTNERS ID : ${idPartner}`
                            });
                        });
                    }
                );
            }
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
};

module.exports = partnerController;
