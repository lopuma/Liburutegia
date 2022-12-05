const connection = require("../../../database/db");

const partnersController = {
    
    // TODO ✅ REENVIAR A LA VISTA DE NUEVO PARTNER
    getNew: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.render("workspace/partners/newPartner", {
                loggedIn,
                rolAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    
    // TODO ✅ OBTENER LA VISTA DE INFORMACION de PARTNERS
    getInfo: async (req, res) => {
        try {
            const id_partner = req.params.idPartner;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlPartner = "SELECT * FROM partners WHERE id_partner = ?";
            const sqlFamily = "SELECT * FROM familys f LEFT JOIN partners p ON f.dni_familiar_partner=p.dni WHERE f.dni_family=? OR f.id_familiar_partner=?";
            await connection.query(sqlPartner, [id_partner], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    });
                }
                const resDataPartners = results;
                const dni = results[0].dni;
                await connection.query(sqlFamily, [dni, id_partner], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            code: 400,
                            message: err
                        });
                    }
                    // res
                    //     .status(200)
                    //     .send({
                    //         partner: resDataPartners,
                    //         infoFamily: results
                    //     })
                    res.status(200).render("workspace/partners/infoPartner", {
                        loggedIn,
                        rolAdmin,
                        partner: resDataPartners,
                        infoFamily: results
                    });
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }

};

module.exports = partnersController;