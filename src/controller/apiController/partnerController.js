const { body, validationResult } = require('express-validator');
const connection = require("../../../database/db");
const flash = require('connect-flash');

const partnerController = {

    //VALIDATIONS
    validate: [ 
        body('email', "The format email address is incorrect.").isEmail(),
        //body('phonea', "The format Phone is incorrect, minimum 9 characters.").isMobilePhone().isLength({min:9, max:9}),
        //body('phoneb', "The format Phone2 is incorrect, minimum 9 characters.").isMobilePhone().isLength({min:9, max:9})
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
            const id_partner = req.params.id_partner;
            await connection.query('SELECT * FROM partners WHERE id_partner = ?', [id_partner], (err, results) => {
                if (err || results.length === 0) {
                    return res.status(404).send({
                        success: false,
                        errorMessage: `Error there is no member with ID PARTNER : ${id_partner}`
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
                    return res.status(200).send({
                        success: true,
                        messageNotFound: "No data found for PARTNERS",
                    });
                }
                res.status(200).send(results);
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
                res.send(results[0]);
            });
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    infoPartner: async(req, res) => {
        try {            
            const idPartner = req.params.idPartner
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlPartner = "SELECT * FROM partners WHERE id_partner = ?"
            const sqlBookin = "SELECT p.id_partner, p.dni, p.name, bk.id_booking, bk.book_id, b.isbn, b.title, b.author, b.reserved, bk.reservation_date, v.id_booking id_booking_review, v.score, v.review, v.deliver_date_review FROM partners p LEFT OUTER JOIN bookings bk ON p.dni=bk.partner_dni INNER JOIN books b ON bk.book_id=b.id_book LEFT OUTER JOIN votes v ON bk.id_booking=v.id_booking WHERE p.dni = ?";
            await connection.query(sqlPartner, [ idPartner ], (err, results) => {
                if (err || results.length === 0) {
                    console.error("error: " + err);
                    return res.send(`There is no partner with that id: ${idPartner}`);
                }
                const dni = results[0].dni;

                connection.query(sqlBookin, [ dni ], (err, results) => {
                    if (err || results.length === 0) {
                        return res.send({
                            "data": results[0],
                            "message":`There is no data with that DNI: ${dni}, associated with the partner with id: ${idPartner}`
                        });
                    }
                    const data = results
                    res.send(data);
                })
            })
        } catch (error) {
            console.error(error)
            res.redirect("/")
        }
    },
    // ADD PARTNERS
    addPartner: async (req, res) => {
        try {
            const errors = validationResult(req);
            const { dni, scanner, name, lastname, direction, population, email } = req.body;
            const sql = "INSERT INTO partners SET ?";
            let phone1 = req.body.phone1;
            let phone2 = req.body.phone2;
            if (!dni || !name || !lastname) {
                req.flash("errorMessage", `Missing data to complete, can not be empty`) 
                return res.status(200).redirect('/workspace/partners/new');
            }
            if( email !== ''){
                if(!errors.isEmpty()){
                    req.flash("errorValidation", errors.array()) 
                    return res.status(200).redirect('/workspace/partners/new');      
                }
            }
            const phonea = phone1 ? parseInt(phone1) : null
            const phoneb = phone2 ? parseInt(phone2) : null

            connection.query(sql, {dni, scanner, name, lastname, direction, population, phone1:phonea, phone2:phoneb, email}, (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash("messageSuccess", `Partner successfully created, with PARTNER ID : ${results.insertId}`) 
                return res.status(200).redirect('/workspace/partners/new');
            }
            );
        } catch (error) {
            req.flash("errorMessage", `error`) 
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
            await connection.query(deleteBookins.join(";"), async (err, results) => {
                if (err) {
                    throw err;
                }
                req.flash("messageUpdate", `Partner successfully delete, with PARTNER ID : ${id_partner}`) 
                return res.redirect('/workspace/partners');
            }
            );
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
            const id_partner = req.params.id_partner;
            const partner = { dni, scanner, name, lastname, direction, population, phone1, phone2, email } = req.body;
            const sql = "UPDATE partners SET ? WHERE id_partner = ?";
            await connection.query(sql, [partner, id_partner], (err, results) => {
                if (err) {
                    throw err;
                }           
                req.flash("messageUpdate", `Partner successfully update, with PARTNER ID : ${id_partner}`) 
                res.send({
                    'success': true,
                    'messageUpdate': `Partner successfully update, with PARTNER ID : ${id_partner}`
                })
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