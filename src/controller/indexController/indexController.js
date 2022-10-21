const indexController = {
    getIndex: async (req, res) => {
        const loggedIn = req.session.loggedin;
        const ruta = req.session.ruta;
        if(loggedIn){
            return res.status(200).redirect(ruta);
        }
        req.session.loggedin = false;
        req.session.roladmin =  false;
        req.session.ruta = "";
        req.session.username = "";
        req.session.usermail = "";
        res.status(200).render('index');
    }
}
module.exports = indexController;