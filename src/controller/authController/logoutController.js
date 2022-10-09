const logoutController = {

    getLogout: async (req, res) => {
        req.session.destroy()
        res.redirect("/");
      }
}

module.exports = logoutController;