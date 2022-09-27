const express = require('express');
const connection = require("../../../database/db");
const routerBooks = express.Router();

routerBooks.get("/", async (req, res) => {
  await connection.query("SELECT * FROM books", function(err, results) {
    if (err) {
      return res.status(404).send(err);
    }
    if (results.length === 0){
      return res.status(404).send(`No data found for BOOKS`);
    }
    res.send(JSON.stringify({data:results}));
  });
});

routerBooks.put("/:id_book", (req, res) => {
  id_book = req.params.id_book;
  title = req.body.title_book;
  author = req.body.author;
  type = req.body.type;
  language = req.body.language;
  console.log("------------", id_book, title, language);
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
});

routerBooks.get("/:id_book", async (req, res) => {
  const id_book = req.params.id_book;
  let sql = `SELECT * FROM books WHERE id_book = ${id_book}`;
  await connection.query(sql, (error, results) => {
	  if (err) {
		  return res.status(404).send(err);
	  }
    if (results.length === 0){
      return res.status(404).send(`No data found for BOOK with ID: ${id_book}`);
    }
	  res.send(JSON.stringify({data:results}));
  });
});




module.exports = routerBooks;