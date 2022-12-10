const { 
    getBooks, 
    getBook, 
    deliverBook, 
    addBook, 
    noExistBook, 
    deleteBook, 
    putBook 
} = require('../../controller/apiController/Books.controller.api');

const {
    isAuthenticated
} = require("../../controller/authController/loginController");


const routerBooks = require('express').Router();
    
    routerBooks.get("/", getBooks);

    routerBooks.get("/:id_book", getBook);

    // DELIVER
    routerBooks.post("/deliver/:id_book", isAuthenticated, deliverBook);

    //ADD
    //routerBooks.post("/add", addBook);

    //DELETE
    routerBooks.get("/delete/:idBook", deleteBook);

    // UPDATE
    //routerBooks.put("/update/:id_book", noExistBook, putBook);

module.exports = routerBooks;