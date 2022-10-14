const { json } = require("express");

const routerReset = {

    postReset: async (req, res) => {
        const { emailReset, newPassword } = req.body;
        console.log(emailReset)
        console.log(newPassword)
        res.send("Recibido-RESE");
        res.end();
      }

    }

module.exports = routerReset;