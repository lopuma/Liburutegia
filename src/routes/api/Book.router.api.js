const multer = require('multer');
const storaStrategy = multer.memoryStorage();
const upload = multer({ storage: storaStrategy });

const {
    getBooks,
    getBook,
    deliverBook,
    addBook,
    noExistBook,
    deleteBook,
    existsCover,
    uploadFile,
    putBook,
} = require('../../controller/apiController/Books.controller.api');

const {
    isAuthenticated
} = require("../../controller/authController/loginController");


const routerBooks = require('express').Router();

routerBooks.get("/", getBooks);

routerBooks.get("/:idBook", getBook);

// DELIVER
routerBooks.post("/deliver/:bookID", deliverBook);

//ADD
//routerBooks.post("/add", addBook);

//DELETE
routerBooks.get("/delete/:idBook", deleteBook);

// UPDATE
//routerBooks.put("/update/:id_book", noExistBook, putBook);

routerBooks.post("/frontPage", upload.single('coverImage'), existsCover, uploadFile);

module.exports = routerBooks;