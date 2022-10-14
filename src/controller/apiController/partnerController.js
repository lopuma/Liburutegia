const { body, validationResult } = require('express-validator');
const connection = require("../../../database/db");

const partnerController = {

    //VALIDATIONS
    validate: [ 
        body('email', "The format email address is incorrect.").isEmail()
    ],
    // EXISTS
    existPartner: async (req, res, next) => {
        try {
            const dni = req.body.dni;
            await connection.query('SELECT * FROM partners WHERE dni = ?', [dni], (err, results) => {
                if (err || results.length === 1) {
                    return res.status(404).send({
                        success: false,
                        message: `There is already a member with DNI : ${dni}`,
                        results
                    });
                } else {
                    next();
                }
            });
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    noExistPartner: async (req, res, next) => {
        try {
            const idPartner = req.params.id_partner;
            await connection.query('SELECT * FROM partners WHERE id_partner = ?', [idPartner], (err, results) => {
                if (err || results.length === 0) {
                    return res.status(404).send({
                        success: false,
                        errorMessage: `Error there is no member with ID PARTNER : ${idPartner}`
                    });
                } else {
                    next();
                }
            });
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    // SHOW ALL PARTNERS
    getPartners: async (req, res) => {
        try {
            await connection.query("SELECT * FROM partners", function (err, results) {
                if (err || results.length === 0) {
                    return res.status(404).send({
                        success: true,
                        messageNotFound: "No data found for PARTNERS",
                        error: err
                    });
                }
                res.status(200).send(JSON.stringify({
                    success: true,
                    messageSuccess: "The following PARTNERS have been found",
                    data: results
                }
                ));
            });
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    // SHOW ONLY PARTNER FOR ID
    getPartner: async (req, res) => {
        try {
            const id_partner = req.params.id_partner;
            var sql = "SELECT * FROM partners WHERE id_partner=?"
            await connection.query(sql, [id_partner], (err, results) => {
                if (err || results.length === 0) {
                    return res.status(404).send({
                        success: true,
                        messageNotFound: `No data found for Id Partner ${id_partner}`,
                        error: err
                    });
                }
                res.send(JSON.stringify({
                    success: true,
                    messageSuccess: `Successfully found partner with ID : ${results[0].id_partner}`,
                    data: results[0]
                }
                ));
            });
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    // ADD PARTNERS
    addPartner: async (req, res) => {
        try {
            const errors = validationResult(req);
            const partner ={ dni, scanner, name, lastname, direction, population, phone1, phone2, email } = req.body;
            const sql = "INSERT INTO partners SET ?";
            if (!partner.dni || !partner.name || !partner.lastname) {
                return res.status(400).send({
                    success: false,
                    errorMessage: `Missing data to complete, can not be empty`
                })
            }
            if(!errors.isEmpty()){
                return res.status(400).send({
                    success: false,
                    errorValidation: errors.array()
                })            
            }

            if(partner.phone1 != undefined || partner.phone1 != null){
                if(typeof(partner.phone1) !== "number" || partner.phone1.toString().length < 9){
                    return res.status(400).send({
                        success: false,
                        errorMessage: `Error in the phone1 format : ${partner.phone1}, minimum 9 characters and value must be numeric.`
                    })
                }
            }
            if(partner.phone2 != undefined || partner.phone2 != null){
                if(typeof(partner.phone2) !== "number" || partner.phone2.toString().length < 9){
                    return res.status(400).send({
                        success: false,
                        errorMessage: `Error in the phone2 format : ${partner.phone2}, minimum 9 characters and value must be numeric.`
                    })
                }
            }
            connection.query(sql, partner, (err, results) => {
                if (err) {
                    throw err;
                } else {
                    return res.status(200).send({
                        success: true,
                        messageSuccess: `Partner successfully created, with PARTNER ID : ${results.insertId}`,
                        partner
                    });
                }
            }
            );
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    // DELETE PARTNER
    deletePartner: async (req, res) => {
        try {
            const id_partner = req.params.id_partner;
            deleteBookins = [`DELETE bookings FROM bookings JOIN partners ON partners.dni = bookings.partner_dni WHERE partners.id_partner = ${id_partner}`,
            `DELETE FROM partners WHERE id_partner =  ${id_partner}`
            ]
            await connection.query(deleteBookins.join(";"), async (err) => {
                if (err) {
                    throw err;
                }
                res.status(200).send({
                    success: true,
                    messageSuccess: `Partner successfully delete, with ID PARTNER : ${id_partner} And reservations related to the partner.`
                });
            })
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    // UDATE PARTNER FOR ID
    putPartner: async (req, res) => {
        try {
            const errors = validationResult(req);
            const idPartner = req.params.id_partner;
            const partner = { dni, scanner, name, lastname, direction, population, phone1, phone2, email } = req.body;
            if (!partner.name || !partner.lastname) {
                return res.status(400).send({
                    success: false,
                    messageNotFound: "Missing data to complete, can not be empty"
                })
            }

            if(!errors.isEmpty()){
                return res.status(400).send({
                    success: false,
                    errorValidation: errors.array()
                })            
            }
            if(partner.phone1 != undefined || partner.phone1 != null){
                if(typeof(partner.phone1) !== "number" || partner.phone1.toString().length < 9){
                    return res.status(400).send({
                        success: false,
                        errorMessage: `Error in the phone1 format : ${partner.phone1}, minimum 9 characters and value must be numeric.`
                    })
                }
            }
            if(partner.phone2 != undefined || partner.phone2 != null){
                if(typeof(partner.phone2) !== "number" || partner.phone2.toString().length < 9){
                    return res.status(400).send({
                        success: false,
                        errorMessage: `Error in the phone2 format : ${partner.phone2}, minimum 9 characters and value must be numeric.`
                    })
                }
            }
            const sql = "UPDATE partners SET ? WHERE id_partner = ?";
            await connection.query(sql, [partner, idPartner], (err, results) => {
                if (err) {
                    throw err;
                } else {
                    return res.status(200).send({
                        success: true,
                        messageSuccess: `Partner successfully update, with PARTNER ID : ${idPartner}`,
                        result: results.message
                    });
                }
            }
            );
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = partnerController;