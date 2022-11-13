const connection = require("../../../database/db");

const workSpaceController = {

  getBooks: async (req, res) => { // TODO ✅
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
      console.log(error)
      res.redirect("/")
    }
  },

  getBookings: async (req, res) => { // TODO ✅
    try {
      const userName = req.session.username;
      const loggedIn = req.session.loggedin;
      const rolAdmin = req.session.roladmin;
      res.render("workspace/dashboard-bookings", {
        loggedIn,
        userName,
        rolAdmin,
      });
    } catch (error) {
      console.log(error)
      res.redirect("/")
    }
  },
  
  getPartners: async (req, res) => { // TODO ✅
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
      console.log(error)
      res.redirect("/")
    }
  },
  
  getAdmin: async (req, res) => { // TODO ✅
    try {
      const userName = req.session.username;
      const loggedIn = req.session.loggedin;
      const rolAdmin = req.session.roladmin;
      sql = "SELECT * FROM users";
      await connection.query(sql, async (error, results) => {
        if (error) {
          throw error;
        }
      const users = results;
        try {
          if (rolAdmin === false) {
            return res.redirect('/');
          }
          res.status(200).render("workspace/dashboard-admin", {
            loggedIn,
            userName,
            users,
            rolAdmin,
          })
        } catch (error) {
          console.log(error)
          res.redirect("/")
        }
      });
    } catch (error) {
      console.log(error)
      res.redirect("/")
    }
  }

}

module.exports = workSpaceController;