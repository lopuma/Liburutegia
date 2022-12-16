const moment = require('moment');
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
            const sqlFamily = "SELECT p.partnerID as partnerID, p.dni as partnerDni, p.name as partnerName, p.lastname as partnerLastname, p.date as partnerRecordDate FROM familys f LEFT JOIN partners p ON f.partnerDNI=p.dni WHERE f.familyDni=?";
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
                const created = results[0].date;
                const update = results[0].updateDate;
                const recordDatePartner = moment(created).format("MMMM Do, YYYY HH:mm A");
                const updateDatePartner = moment(update).format("MMMM Do, YYYY HH:mm A");
                const resDataPartners = results.map(data => ({
                    ...data,
                    date: recordDatePartner,
                    updateDate: updateDatePartner
                }));
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
                    if (results.length !== 0) {
                        fechaAlta = results[0].partnerRecordDate;
                        const recordDate = moment(fechaAlta).format("MMMM Do, YYYY HH:mm A");
                        const updatedDataAddPartner = results.map(
                            data => ({
                                ...data,
                                partnerRecordDate: recordDate
                            })
                        );
                        return res
                            .status(200)
                            .render(
                                "workspace/partners/infoPartner",
                                {
                                    loggedIn,
                                    rolAdmin,
                                    partner: resDataPartners,
                                    infoFamily: updatedDataAddPartner
                                }
                            );
                    }
                    res
                        .status(200)
                        .render(
                            "workspace/partners/infoPartner",
                            {
                                loggedIn,
                                rolAdmin,
                                partner: resDataPartners,
                                infoFamily: null
                            }
                        );
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }

};

module.exports = partnersController;