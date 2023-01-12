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
    infoReviews,
    validate
} = require('../../controller/apiController/Books.controller.api');

const {
    isAuthenticated
} = require("../../controller/authController/loginController");

// TODO 👌 
const routerBooks = require('express').Router();

    routerBooks.get("/", getBooks);

    routerBooks.get("/:idBook", noExistBook, getBook);

    routerBooks.post("/deliver/:bookID", deliverBook);

    routerBooks.post("/add", addBook);

    routerBooks.get("/delete/:idBook", deleteBook);

    routerBooks.post("/update/:idBook", noExistBook, validate, putBook);

    routerBooks.post("/frontPage", upload.single('coverImage'), existsCover, uploadFile);

    routerBooks.get("/info/reviews/:idBook", infoReviews);

module.exports = routerBooks;