//const MySqlStore = require('express-mysql-session')

const logoutController = {

  // TODO ✅ CIERRA SECCION
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
    res.redirect("/");
  }
};

module.exports = logoutController;