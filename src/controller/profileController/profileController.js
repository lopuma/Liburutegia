const profileController = {

    
    getProfile: async (req, res) => { // TODO: ✅
        try {
            const loggedIn = req.session.loggedin;
            const userRol = req.session.rol;
            const userProfile = req.session.profile;
            const rolAdmin = req.session.roladmin;
            const userName = req.session.username;
            if( loggedIn && userRol === "data entry" ) {
                return res.status(200).render('profile/profile',{
                    loggedIn,
                    userProfile,
                    userName,
                    rolAdmin
                });
            }
            res.status(200).redirect('/');
        } catch (error) {
            console.log(error)
            res.redirect("/")
        }
    }
}

module.exports = profileController;