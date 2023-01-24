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

//routerBooks.post("/deliver/:bookID", isAuthenticated, deliverBook);
routerBooks.post("/deliver/:bookID", deliverBook);

//routerBooks.post("/add", isAuthenticated, validate, addBook);
routerBooks.post("/add", validate, addBook);

    routerBooks.get("/delete/:idBook", isAuthenticated, deleteBook);

    routerBooks.post("/update/:idBook", isAuthenticated, noExistBook, validate, putBook);

//routerBooks.post("/frontPage", isAuthenticated, upload.single('coverImage'), existsCover, uploadFile);
routerBooks.post("/frontPage", upload.single('coverImage'), existsCover, uploadFile);

    routerBooks.get("/info/reviews/:idBook", infoReviews);

module.exports = routerBooks;