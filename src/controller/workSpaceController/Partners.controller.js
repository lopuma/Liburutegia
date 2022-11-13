const connection = require("../../../database/db");

const partnersController = {
    
    getNew: async(req, res) => { // TODO ✅
        try {
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.render('workspace/partners/newPartner', {
                loggedIn,
                rolAdmin
            }
            )
        } catch (error) {
            console.log(error)
            res.redirect("/")
        }
    },
    // OBTENER LA VISTA DE INFORMACION de PARTNERS
    getInfo: async(req, res) => {
        try {            
            
            const idPartner = req.params.idPartner
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            
            const sqlPartner = "SELECT * FROM partners WHERE id_partner = ?"
        
            await connection.query(sqlPartner, [ idPartner ], (err, results) => {
                if (err){
                    return console.error("error: " + err);
                }
                const partner = results;
                res.render('workspace/partners/infoPartner', {
                    loggedIn,
                    rolAdmin,
                    partner
                } 
                )
            })
        } catch (error) {
            console.log(error)
            res.redirect("/")
        }
    }
}

module.exports =  partnersController;