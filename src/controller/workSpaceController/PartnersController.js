const database = require('../../../database/keys')
const partnersController = {

    getNew: async(req, res) => {
        res.render('workspace/partners/new')
    },
    getShow: async(req, res) => {
        res.send("hola show partners")
    },
    getDelete: async(req, res) => {
        res.send("hola delete partners")
    },
    getUpdate: async(req, res) => {
        res.send("hola update partners")
    }

}

module.exports =  partnersController;