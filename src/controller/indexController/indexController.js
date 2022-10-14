const indexController = {

    getIndex: async (req, res, next) => {
        const loggedIn = req.session.loggedin;
        const ruta = req.session.ruta;
        if(loggedIn){
            return res.status(200).redirect(ruta);
        }
        req.session.loggedin = false;
        req.session.username = "";
        res.status(200).render('index');
    }
}
module.exports = indexController;