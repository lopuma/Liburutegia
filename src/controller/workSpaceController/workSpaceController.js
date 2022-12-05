const connection = require("../../../database/db");

const workSpaceController = {

  // TODO ✅ REDIRIGE A LA VISTA DE BOOKS
  getBooks: async (req, res) => {
    try {
      const userName = req.session.username;
      const loggedIn = req.session.loggedin;
      const rolAdmin = req.session.roladmin;
      res.render("workspace/dashboard-books", {
        loggedIn,
        userName,
        rolAdmin
      });
    } catch (error) {
      console.error(error);
      res.status(500).redirect("/");
    }
  },

  // TODO ✅ REDIRIGE A LA VISTA DE BOOKINGS
  getBookings: async (req, res) => {
    try {
      const userName = req.session.username;
      const loggedIn = req.session.loggedin;
      const rolAdmin = req.session.roladmin;
      res.render("workspace/dashboard-bookings", {
        loggedIn,
        userName,
        rolAdmin
      });
    } catch (error) {
      console.error(error);
      res.status(500).redirect("/");
    }
  },

  // TODO ✅ REDIRIGE A LA VISTA DE PARTNERS
  getPartners: async (req, res) => {
    try {
      const userName = req.session.username;
      const loggedIn = req.session.loggedin;
      const rolAdmin = req.session.roladmin;
      res.render("workspace/dashboard-partners", {
        loggedIn,
        userName,
        rolAdmin
      });
    } catch (error) {
      console.error(error);
      res.status(500).redirect("/");
    }
  },

  // TODO ✅ REDIRIGE A LA VISTA DE ADMIN
  getAdmin: async (req, res) => {
    try {
      const userName = req.session.username;
      const loggedIn = req.session.loggedin;
      const rolAdmin = req.session.roladmin;
      sqlSelect = "SELECT * FROM users";
      await connection.query(sqlSelect, async (err, results) => {
        if (err) {
          console.error("[ DB ]", err.sqlMessage);
          return res.status(400).send({ code: 400, message: err });
        }
        const users = results;
        try {
          if (rolAdmin === false) {
            return res.redirect("/");
          }
          res
            .status(200)
            .render("workspace/dashboard-admin", {
              loggedIn,
              userName,
              users,
              rolAdmin
            });
        } catch (error) {
          console.error(error);
          res.status(500).redirect("/");
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).redirect("/");
    }
  }
};

module.exports = workSpaceController;