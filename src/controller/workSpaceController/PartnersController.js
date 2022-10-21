const database = require('../../../database/keys')
const partnersController = {

    getNew: async(req, res) => {
        const userName = req.session.username;
        const loggedIn = req.session.loggedin;
        const userMail = req.session.usermail;
        res.render('workspace/partners/new', {
            loggedIn,
            userName,
            userMail,
            rolAdmin
        }
        )
    },
    getShow: async(req, res) => {
        res.send("hola show partners")
    }
}

module.exports =  partnersController;