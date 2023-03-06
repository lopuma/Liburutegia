const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const configCors = require('./configCors');
const config = require('./config');
let RedisStore = require("connect-redis")(session)
const redisClient = require('../redis/redis-connect')

// APP EXPRESS
const app = express();
app.set('trust proxy', 1);
app.use(cors(
	configCors.application.cors.server
));
console.info(`The display is in (${config.NODE_ENV})`);
const PORT = config.PORT;
app.use(morgan('dev'));
app.use(session({
    key: "connectionUsers",
    secret: 'secret',
	resave: false,
	saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
	cookie: {
        expires: 4 * 60 * 60 * 1000 // =>> 4 horas
    }
}));
app.use(flash());
app.use((req, res, next) => {
	res.locals.messageSuccess = req.flash('messageSuccess');
	res.locals.messageUpdate = req.flash('messageUpdate');
	res.locals.messageDelete = req.flash('messageDelete');
	res.locals.errorValidation = req.flash('errorValidation');
	res.locals.errorMessage = req.flash("errorMessage");
	res.locals.errorUser = req.flash("errorUser");
	res.locals.errorPassword = req.flash("errorPassword");
	next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use('/style', express.static(__dirname + '/public/css'));
app.use('/image', express.static(__dirname + '/public/img'));
app.use('/scripts', express.static(__dirname + '/public/js'));
app.use('/DataTables', express.static(__dirname + '/public/lib/DataTables'));
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs',
}));
app.set('view engine', '.hbs'); 
app.use('/', require('./routes/IndexRouter')); // PAGINA PRICIPAL
app.use('/profile', require('./routes/profile/ProfileRouter'));
app.use('/workspace', require('./routes/workspace/WorkspaceRouter'));
app.use("/workspace/partners", require("./routes/workspace/Partners.router"));
app.use("/workspace/books", require("./routes/workspace/Books.router"));
app.use('/api/books',    require( './routes/api/Book.router.api'    ))
app.use('/api/bookings', require( './routes/api/Booking.router.api' ))
app.use("/api/partners", require("./routes/api/Partner.router.api"));
app.use("/api/familys", require("./routes/api/Family.router.api"));
app.use("/api/users", require("./routes/api/Users.router.api"));
app.use('/login',    require( './routes/authentication/LoginRouter'    ))
app.use('/logout',   require( './routes/authentication/LogoutRouter'   ))
app.use('/reset',    require( './routes/authentication/ResetRouter'    ))
app.use('/register', require( './routes/authentication/RegisterRouter' ))
app.use(function(req, res){
	res.render('error_page/404')
})
app.listen(PORT, () => {
	console.info(`The Server is connected on the PORT: ${PORT}`, `http://0.0.0.0:${PORT}`);
});