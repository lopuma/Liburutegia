const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');

const routerReset = {

  userExists: async (req, res, next) => {
    try {
      const { emailReset } = req.body;
      const sql = "SELECT * FROM users WHERE email = ?";
      console.log("VALIDACION => ", {emailReset})
      await connection.query(sql, [emailReset], async (err, results) => {
        if (err) {
            console.error("[ DB ]", err.sqlMessage);
            return res.status(400).send({
                code: 400,
                message: err
            });
        } 
        if (results.length === 0) {
            req.session.exists = false;req.session.exists = false;
            return res.status(200).send({
              messageEmailReset: "Your account could not be found in Liburutegia.",
              exists: req.session.exists
            });
        } else {
          next();
        }
      });
    } catch (error) {
      console.error(error)
      res.status(500).redirect("/")
    }  
  },
  postReset: async (req, res) => {
    try {
      const { emailReset, passReset } = req.body;
      console.log({ emailReset, passReset })
      req.session.exists = true;
      if ( passReset !== undefined ){
        let passwordHash = await bscryptjs.hash(passReset, 8);
        const sql = `UPDATE users set pass="${passwordHash}" WHERE email = ?`;
        await connection.query( sql, emailReset, (err, results) => {
          if (err) {
            console.error("[ DB ]", err.sqlMessage);
            return res.status(400).send({
                code: 400,
                message: err
            });
          }
          console.log("RES => ", {results})
          res.send({
            "successValidation":"Password has been changed successfully",
            "exists" : req.session.exists         
          });
          res.end();
        })
      } else {
        res.send({
          "successValidation":"User exists in the Liburutegia database",
          "exists" : req.session.exists         
        });
        res.end();
      }
      } catch (error) {
        throw error;
      }
    }
  }

module.exports = routerReset;