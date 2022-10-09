const connection = require("../../../database/db");

const bookController = {
    // SHOW ALL BOOKS
    getBooks: async (req, res) =>{
        try {
            await connection.query("SELECT * FROM books", function(err, results) {
                if (err || results.length === 0) {
                  return res.status(404).send({
                    success : false,
                    message: "No data found for BOOKS",
                    error: err.message
                  });
                }
                return res.status(200).send(JSON.stringify({
                    success: true,
                    message: "The following BOOKS have been found", 
                    data:results
                }
                ));
              });
        } catch (error) {
            throw res.status(400).send({
                success: false,
                message: error.message
            })        }
    },
    // SHOW ONLY BOOK FOR ID
    getBook: async (req, res) =>{
        try {
            const id_book = req.params.id_book;
            let sql = `SELECT * FROM books WHERE id_book = ${id_book}`;
            await connection.query(sql, (error, results) => {
                if (error || results.length === 0) {
                    return res.status(404).send({
                        success : false,
                        message: "No data found for BOOKS",
                        error: err.message
                      });                }
                res.send(JSON.stringify({
                    success: true,
                    message: `Successfully found book with ID : ${results[0].id_book}`,
                    data:results[0]
                }
                ));
            });
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            })
        }
    },
    // UDATE BOOK FOR ID
    putBooks: async (req, res) =>{
        try {
            id_book = req.params.id_book;
            title = req.body.title_book;
            author = req.body.author;
            type = req.body.type;
            language = req.body.language;
            let sql =
                "UPDATE books SET title = ?, author = ?, type = ?, language = ? WHERE id_book = ?";
            connection.query(sql, [title, author, type, language, id_book], function(
                error,
                result
            ) {
                if (error) {
                throw error;
                } else {
                console.log(result);
                res.send(result);
                }
            });
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = bookController;