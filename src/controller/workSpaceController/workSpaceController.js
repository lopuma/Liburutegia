const connection = require("../../../database/db");
const flash = require('connect-flash');

const workSpaceController = {

    getBooks: async (req, res) =>{
        const userName = req.session.username;
        const loggedIn = req.session.loggedin;
        const userMail = req.session.usermail;
        res.render("workspace/dashboard-books", {
          loggedIn,
          userName,
          userMail,
          rolAdmin
        });
    },
    getBookings: async (req, res) => {
        const userName = req.session.username;
        const loggedIn = req.session.loggedin;
        const userMail = req.session.usermail;
        res.render("workspace/dashboard-bookings", {
            loggedIn,
            userName,
            userMail,
            rolAdmin
        });
    },
    getPartners: async (req, res) => {
        const userName = req.session.username;
        const loggedIn = req.session.loggedin;
        const userMail = req.session.usermail;
        res.render("workspace/dashboard-partners", {
          loggedIn,
          userName,
          userMail,
          rolAdmin
        });
    },
    getAdmin: async (req, res) => {
        const userName = req.session.username;
        const userMail = req.session.usermail;
        const loggedIn = req.session.loggedin;
        sql = "SELECT * FROM users";
        await connection.query(sql, async (error, results) => {
          if(error){
            throw error;
          }
          const users =  results;
          if(rolAdmin === false){
            return res.redirect('/');
          }
          res.render("workspace/dashboard-admin", {
            loggedIn,
            userName,
            userMail,
            users,
            rolAdmin,
            messageSuccess: req.flash("messageSuccess"),
            messageDelete: req.flash("messageDelete")
          })
        });
    }
}

module.exports = workSpaceController;