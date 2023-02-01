const indexController = {

    // TODO ✅ REENVIAR A LA VISTA DE INICIO
    getIndex: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const userPath = req.session.ruta;
            if (loggedIn) {
                return res.status(200).redirect(userPath);
            }
           /* req.session.loggedin = false;
            req.session.username = "";
            req.session.usermail = "";
            req.session.profile = "";
            req.session.ruta = "";
            req.session.rol = "";
            req.session.roladmin = false;*/
            console.log("RESEULTS loginRol -2- =>> ", req.session)
            res.status(200).render("index");
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
    
};

module.exports = indexController;