const routerBooks = require('express').Router();
const { getBooks, getBook, deliverBook, addBook, noExistBook, deleteBook, putBook } = require('../../controller/apiController/bookController');

routerBooks.get("/", getBooks);

routerBooks.get("/:id_book", getBook);

routerBooks.post("/deliver/:id_book", deliverBook);

//ADD
//routerBooks.post("/add", addBook);

//DELETE
//routerBooks.delete("/delete/:id_book", noExistBook, deleteBook);

// UPDATE
//routerBooks.put("/update/:id_book", noExistBook, putBook);

module.exports = routerBooks;