const routerBooks = require('express').Router();
const bookController = require('../../controller/bookController');

routerBooks.get("/", bookController.getBooks);
routerBooks.get("/:id_book", bookController.getBook);
routerBooks.put("/:id_book", bookController.putBooks);

module.exports = routerBooks;