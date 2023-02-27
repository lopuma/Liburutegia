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
    validate,
    redisBooks,
    redisBook,
    redisInfoReview,
    redisISBN
} = require('../../controller/apiController/Books.controller.api');
const {
    isAuthenticated
} = require("../../controller/authController/loginController");
const {
	existBooking
} = require("../../controller/apiController/Bookings.controller.api");
const routerBooks = require('express').Router();
    routerBooks.get("/", redisBooks, getBooks);
    routerBooks.get("/:idBook", redisBook, noExistBook, getBook);
    routerBooks.post("/deliver/:idBook", isAuthenticated, existBooking, deliverBook);   
    routerBooks.post("/add", isAuthenticated, validate, addBook);
    routerBooks.get("/delete/:idBook", deleteBook);
    routerBooks.post("/update/:idBook", noExistBook, validate, putBook);
    routerBooks.post("/frontPage", isAuthenticated, upload.single('coverImage'), existsCover, uploadFile);
    routerBooks.get("/info/reviews/:idBook", redisInfoReview, infoReviews);
    routerBooks.get("/isbn/:isbn", redisISBN, getISBN);
module.exports = routerBooks;