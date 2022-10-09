const connection = require("../../../database/db");

const partnerController = {
    // EXISTS
    existPartner: async(req, res, next) =>{
        try {
            const dni = req.body.dni;
            await connection.query('SELECT * FROM partners WHERE dni = ?', [dni], (err, results) =>{
                if(err || results.length === 1){
                    return res.status(404).send({
                        success: false,
                        message: `There is already a member with DNI : ${dni}`,
                        results
                    });
                } else{
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
    noExistPartner: async(req, res, next) =>{
        try {
            const idPartner = req.params.id_partner;
            await connection.query('SELECT * FROM partners WHERE id_partner = ?', [idPartner], (err, results) =>{
                if(err || results.length === 0){
                    return res.status(404).send({
                        success: false,
                        message: `There is no member with ID_PARTNER : ${idPartner}`,
                        results
                    });
                } else{
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
    getPartners: async (req, res) =>{
        try {
            await connection.query("SELECT * FROM partners", function(err, results) {
                if (err || results.length === 0) {
                return res.status(404).send({
                  success : false,
                  message: "No data found for PARTNERS",
                  error: err.message
                });	  }
                return res.status(200).send(JSON.stringify({
                  success: true,
                  message: "The following PARTNERS have been found", 
                  data:results
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
    getPartner: async (req, res) =>{
        try {
            const id_partner = req.params.id_partner;
            var sql = "SELECT * FROM partners WHERE id_partner=?"
              await connection.query(sql, [id_partner], (err, results) => {
              if (err || results.length === 0) {
                return res.status(404).send({
                    success : false,
                    message: "No data found for PARTNER",
                    error: err.message
                  });
                }
                res.send(JSON.stringify({
                  success: true,
                  message: `Successfully found partner with ID : ${results[0].id_partner}`,
                  data:results[0]
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
    addPartner: async (req, res) =>{          
            try {
                const {dni, name, lastname, direction, phone, email } = req.body;
                var sql = "INSERT INTO partners SET ?";
                let partner = {dni, name, lastname, direction, phone, email}
                if (!dni || !name || !lastname || !phone){
                    return res.status(400).send({
                    success: false,
                    message: "Missing data to complete, can not be empty"
                    })
                }
                connection.query(sql, partner, function(error, results) {
                    if (error) {
                        throw error;
                    } else {
                        return res.status(200).send({
                        success: true,
                        message: `Partner successfully created, with PARTNER ID : ${results.insertId}`,
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
            await connection.query(deleteBookins.join(";"), async (err, results) =>{
              if (err) {
                return res.status(404).send(err);
              }
              console.log(results.length)
              if (results.length === 0){
                return res.status(404).send(`There are NO reservations for the member with ID`);
              }
              return res.status(200).send({
                success: true,
                message: `Booking successfully delete, with PARTNER ID : ${id_partner} And reservations related to the partner. `
              });
            })
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })        
        }
    },
    // DUPLICADO
    duplicatePartner: async (req, res, next) => {
        try {
            const idPartner = req.params.id_partner;
            const dni = req.body.dni;
            console.log(idPartner)
            await connection.query('SELECT * FROM partners WHERE id_partner = ? and dni = ?', [idPartner, dni], (err, results) =>{
                if (results.length === 1){
                    next();
                } else{
                    connection.query('SELECT * FROM partners WHERE id_partner = ?', [idPartner], (err, results) =>{
                        if(err || results.length === 1){
                            connection.query('SELECT * FROM partners WHERE dni = ?', [dni], (err, results) =>{
                                console.log(results.length);
                                if(err || results.length === 1){
                                    return res.status(404).send({
                                            success: false,
                                            message: `There is already a member with DNI : ${dni}`,
                                            results
                                        });
                                } else {
                                    next();
                                }
                            });
                        } else{
                            next();
                        }
                    });
                }
            });
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })        
        }
    },
    // UDATE PARTNER FOR ID
    putPartner: async (req, res) =>{
        try {
            const idPartner = req.params.id_partner;
            console.log(idPartner)
            const { dni, scanner, name, lastname, direction, phone, email }  = req.body;
        
            if (!name || !lastname || !phone){
              return res.status(400).send({
                success: false,
                message: "Missing data to complete, can not be empty"
              })
            }
            let sql = "UPDATE partners SET dni = ?, scanner = ?, name = ?, lastname = ?, direction = ?, phone = ?, email = ? WHERE id_partner = ?";
            await connection.query(sql, [dni, scanner, name, lastname, direction, phone, email, idPartner],
              function(error, results) {
                if (error) {
                  throw error;
                } else {
                  return res.status(200).send({
                    success: true,
                    message: `Partner successfully update, with PARTNER ID : ${idPartner}`, 
                    results
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