const { body, validationResult } = require("express-validator");
const connection = require("../../../database/db");
const flash = require("connect-flash");

const familyController = {

    getFamily: async (req, res) => {
        console.log("llego");
        try {
            const sqlSelect = "SELECT * FROM familys f LEFT JOIN partners p ON f.dni_familiar_partner=p.dni";
            await connection.query(sqlSelect, (err, results) => {

                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    })
                }
                res
                    .status(200)
                    .send(
                        results
                    );
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
    
};

module.exports = familyController;
