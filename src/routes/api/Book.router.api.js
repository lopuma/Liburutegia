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
    getISBN,
    validate
} = require('../../controller/apiController/Books.controller.api');

const {
    isAuthenticated
} = require("../../controller/authController/loginController");

const {
	existBooking
} = require("../../controller/apiController/Bookings.controller.api");

// TODO 👌 
const routerBooks = require('express').Router();

    routerBooks.get("/", getBooks);

    routerBooks.get("/:idBook", noExistBook, getBook);

//routerBooks.post("/deliver/:bookID", isAuthenticated, existBooking, deliverBook);
routerBooks.post("/deliver/:idBook", existBooking, deliverBook);

//routerBooks.post("/add", isAuthenticated, validate, addBook);
routerBooks.post("/add", validate, addBook);

    routerBooks.get("/delete/:idBook", deleteBook);

    routerBooks.post("/update/:idBook", noExistBook, validate, putBook);

//routerBooks.post("/frontPage", isAuthenticated, upload.single('coverImage'), existsCover, uploadFile);
routerBooks.post("/frontPage", upload.single('coverImage'), existsCover, uploadFile);

    routerBooks.get("/info/reviews/:idBook", infoReviews);

    routerBooks.get("/isbn/:isbn", getISBN);

module.exports = routerBooks;