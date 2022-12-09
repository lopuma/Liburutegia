const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db");
const flash = require("connect-flash");

const familyController = {

    getFamily: async (req, res) => {
        console.log("llego");
        const dni = req.params.dniPartner;
        try {
            const sqlSelect = "SELECT * FROM familys f LEFT JOIN partners p ON f.dni_familiar_partner=p.dni WHERE f.dni_family=?";
            await connection.query(sqlSelect, dni, (err, results) => {

                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    })
                }
                console.log(results.length);
                if (results.length === 0) {
                    return res
                        .status(200)
                        .send({
                            success: true,
                            message: "No family found with this DNI",
                            data: null
                        });
                }
                res
                    .status(200)
                    .send({
                        success: true,
                        message: "Family found with this DNI",    
                        data: results[0]
                    })
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }

};

module.exports = familyController;
