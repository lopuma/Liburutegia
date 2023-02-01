const logoutController = {
    getLogout: async (req, res) => {
        try {
            req.session.loggedin = false;
            req.session.username = "";
            req.session.rol = "";
            req.session.usermail = "";
            req.session.ruta = "";
            req.session.roladmin = "";
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
        req.session.destroy();
        res.status(400).redirect("/");
    }
};
module.exports = logoutController;