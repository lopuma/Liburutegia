const logoutController = {

    getLogout: async (req, res) => {
        req.session.loggedin = false;
        console.log("==> // ", req.session.loggedin, " // <==")
        req.session.username = "";
        req.session.destroy()
        res.redirect("/");
      }
}

module.exports = logoutController;