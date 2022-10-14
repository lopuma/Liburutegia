const profileController = {

    getProfile: async (req, res, next) => {
        const loggedIn = req.session.loggedin;
        const userName = req.session.username;
        const userMail = req.session.usermail;
        const userRol = req.session.rol;
        console.log(`==> ROL :: ${rolAdmin} <==`)
        if( loggedIn && userRol === "data entry" ){
            return res.status(200).render('profile/profile',{
                loggedIn,
                userName,
                userMail,
                rolAdmin
              });
        }
        res.status(200).redirect('/');
    }
}
module.exports = profileController;