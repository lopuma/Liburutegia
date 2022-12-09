const profileController = {

    // TODO: ✅ REENVIAR A LA VISTA DE PROFILE
    getProfile: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const userRol = req.session.rol;
            const userProfile = req.session.profile;
            const rolAdmin = req.session.roladmin;
            const userName = req.session.username;
            if (loggedIn && userRol === "data entry") {
                return res.status(200).render("profile/profile", {
                    loggedIn,
                    userProfile,
                    userName,
                    rolAdmin
                });
            }
            res.status(400).redirect("/");
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    }
    
};

module.exports = profileController;