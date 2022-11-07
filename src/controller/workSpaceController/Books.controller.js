const connection = require("../../../database/db");

const booksController = {
    
    getNew: async(req, res) => { // TODO ✅
        try {
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res.render('workspace/books/new', {
                loggedIn,
                rolAdmin
            }
            )
        } catch (error) {
            console.log(error)
            res.redirect("/")
        }
    },
    // OBTENER LA VISTA DE INFORMACION de PARTNERS
    getInfo: async(req, res) => {
        try {            
            
            const idBook = req.params.idBook
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            
            const sqlBook = "SELECT * FROM books WHERE id_book = ?"
            
            await connection.query(sqlBook, [ idBook ], (err, results) => {
                if (err){
                    return console.error("error: " + err);
                }
                const book = results;
                res.render("workspace/book/info", {
                    loggedIn,
                    rolAdmin,
                    book
                });
            })
        } catch (error) {
            console.log(error)
            res.redirect("/")
        }
    }
}

module.exports =  booksController;