const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session)
const cors = require('cors');

const config = require('./config');

// 1 - Iniciar express
const app = express();

// 2 - Usamos Cors
app.use(cors(
	config.application.cors.server
));

//3 - Invocamos a dotenv
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config({
		path: path.resolve(__dirname, '../env/.env')
	});
}

// 4 - Configuraciones
const PORT = process.env.PORT || 3000;
const { database } = require('../database/keys.js');

// 5 - Morgan para mostrar datos de peticiones
app.use(morgan('dev'));

// 6 - Crear una SSESSION
app.use(session({
	//cookie: { maxAge: 60000 },
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	//store: new MySqlStore(database),
	//maxAge: 8 * 60 * 60 * 1000
}));

// 7 - Usar mensajes de sistemas y enviar al cliente
app.use(flash());

// / 8 - Global Variables - MILDEWER
app.use((req, res, next) => {
	res.locals.messageSuccess = req.flash('messageSuccess');
	res.locals.messageUpdate = req.flash('messageUpdate');
	res.locals.messageDelete = req.flash('messageDelete');
	res.locals.errorValidation = req.flash('errorValidation');
	res.locals.errorMessage = req.flash("errorMessage");
	res.locals.errorUser = req.flash("errorUser");
	res.locals.errorPassword = req.flash("errorPassword");
	//res.locals.errorEmailReset = req.flash('errorEmailReset');
	//res.locals.success = req.session.success;
	next();
});

// 9 - Capturar los datos de formularios.
app.use(express.urlencoded({ extended: true })); // aceptar datos del formulario (extended : false), solo acepta text
app.use(express.json()); // recibir JSON
app.use(bodyParser.json());

// 10 - Recursos Publicos
app.use(express.static(path.join(__dirname,'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use('/style', express.static(__dirname + '/public/css'));
app.use('/image', express.static(__dirname + '/public/img'));
app.use('/scripts', express.static(__dirname + '/public/js'));
app.use('/DataTables', express.static(__dirname + '/public/frameworks/DataTables'));

// 11 - Establecer Motor de plantilla
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs',
	helpers: require('./lib/handlebars') // EJECUTAR FUNCIONES
}))
app.set('view engine', '.hbs'); 

// Creamos usuario inicial
//const userDef = require('../src/routes/db/userDefault');
//userDef();

// 12 - ROUTERS VIEWS
app.use('/', require('./routes/IndexRouter')); // PAGINA PRICIPAL
app.use('/profile', require('./routes/profile/ProfileRouter'));
app.use('/workspace', require('./routes/workspace/WorkspaceRouter'));
app.use("/workspace/partners", require("./routes/workspace/Partners.router"));
app.use("/workspace/books", require("./routes/workspace/Books.router"));
//app.use("/workspace/partners", require("./routes/workspace/Partners.router"));

// 12.1 - ROUTERS API
app.use('/api/books',    require( './routes/api/Book.router.api'    ))
app.use('/api/bookings', require( './routes/api/Booking.router.api' ))
app.use("/api/partners", require("./routes/api/Partner.router.api"));
app.use("/api/familys", require("./routes/api/Family.router.api"));
app.use('/api/votes',    require( './routes/api/Vote.router.api'    ))

// 12.2 - ROUTES AUTH
app.use('/login',    require( './routes/authentication/LoginRouter'    ))
app.use('/logout',   require( './routes/authentication/LogoutRouter'   ))
app.use('/reset',    require( './routes/authentication/ResetRouter'    ))
app.use('/register', require( './routes/authentication/RegisterRouter' ))

// 12.3 RUTAS QUE NO EXISTE
app.use(function(req, res){
	res.render('error_page/404')
})

// 13 - Starting the server
app.listen(PORT, () => {
	console.log(`Server is in port , ${PORT}`, `http://127.0.0.1:${PORT}`);
});