const connection = require("../../../connections/database/db-connect");
const redisClient = require("../../../connections/redis/redis-connect");
const workSpaceController = {
    redisUsers : async (req, res, next) => {
        await redisClient.get('users', (err, reply) => {
            if(reply) {
                const userName = req.session.username;
                const loggedIn = req.session.loggedin;
                const rolAdmin = req.session.roladmin;
                const users = JSON.parse(reply);
                res.status(200).render("workspace/dashboard-admin", {
                    loggedIn,
                    userName,
                    users,
                    rolAdmin
                });
            } 
            next();
        });
    },
    redisUser: async (req, res, next) => {
        const userID = req.params.idUser || req.body.idUser;
        await redisClient.get('users', (err, reply) => {
          if (reply) {
            const data = JSON.parse(reply);
            let foundUser = false;
            data.forEach((element) => {
              if (element.id === parseInt(userID)) {
                foundUser = true;
                const data = element;
                res.status(200).send({
                  success: true,
                  swalTitle: "Succes...",
                  messageSuccess: "User exists.",
                  data
                });
              }
            });
            if (!foundUser) {
              next();
            }
          } else {
            next();
          }
        });
      },
    getBooks: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.status(200).render("workspace/dashboard-books", {
                loggedIn,
                userName,
                rolAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getBookings: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.status(200).render("workspace/dashboard-bookings", {
                loggedIn,
                userName,
                rolAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getPartners: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.status(200).render("workspace/dashboard-partners", {
                loggedIn,
                userName,
                rolAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getAdmin: async (req, res) => {
        try {
            const userName = req.session.username;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            
            sqlSelect = "SELECT * FROM users";
            connection.query(sqlSelect, async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res
                        .status(400)
                        .send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                }
                const users = results;
                try {
                    if (rolAdmin === false) {
                        return res.status(400).redirect("/");
                    }
                    await redisClient.set('users', JSON.stringify(users), async (err, reply) => {
                        if(err) return console.error(err);
                        if(reply) {
                            await redisClient.expire(`users`, 14400)
                            res.status(200).render("workspace/dashboard-admin", {
                                loggedIn,
                                userName,
                                users,
                                rolAdmin
                            });
                        }
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
