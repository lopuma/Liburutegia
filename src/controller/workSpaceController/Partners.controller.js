const connection = require("../../../database/db");

const partnersController = {

    // TODO ✅ REENVIAR A LA VISTA DE NUEVO PARTNER
    getNew: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.status(200).render("workspace/partners/newPartner", {
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
            const partnerID = req.params.idPartner;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const sqlPartner = "SELECT * FROM partners WHERE partnerID = ?";
            const sqlFamily = "SELECT p.dni as partnerDni, p.name as partnerName, p.lastname as partnerLastname, p.date as partnerRecordDate FROM familys f LEFT JOIN partners p ON f.partnerDNI=p.dni WHERE f.familyDni=?";
            await connection.query(sqlPartner, [partnerID], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res
                        .status(400)
                        .send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                }
                const resDataPartners = results;
                const dni = results[0].dni;
                await connection.query(sqlFamily, [dni], async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res
                            .status(400)
                            .send({
                                success: false,
                                messageErrBD: err,
                                errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                            });
                    }
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