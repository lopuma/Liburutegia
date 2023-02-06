const indexController = {

    // TODO ✅ REENVIAR A LA VISTA DE INICIO
    getIndex: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const userPath = req.session.ruta;
            if (loggedIn) {
                return res.status(200).redirect(userPath);
            }
            res.status(200).render("index");
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
    
};

module.exports = indexController;