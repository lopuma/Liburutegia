const indexController = { 
    
    getIndex: async (req, res) => { // TODO ✅
        const loggedIn = req.session.loggedin;
        const userPath = req.session.ruta;
        if(loggedIn){
            return res.status(200).redirect(userPath);
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