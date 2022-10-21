const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const MySqlStore = require('express-mysql-session')
const session = require('express-session');
const cors = require('cors');

const config = require('./config');

// Iniciar express
const app = express();

app.use(cors(
	config.application.cors.server
  ));
//3- Invocamos a dotenv
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config({
		path: path.resolve(__dirname, '../env/.env')
	});
}

// Configuraciones
const PORT = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('tables', path.join(__dirname, 'views/workspace/tables'));

const { database } = require('../database/keys.js');

app.use(morgan('dev'));
// 7 - Variables de SSESSION
app.use(session({
	//cookie: { maxAge: 60000 },
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	//store: new MySqlStore(database),
	//maxAge: 1 * 60 * 60 * 1000
}));

app.use(flash()); // enviar mensajes al cliente

// Global Variables - MILDEWER
app.use((req, res, next) => {
	res.locals.messageSuccess = req.flash('messageSuccess');
	res.locals.messageUpdate = req.flash('messageUpdate');
	res.locals.messageDelete = req.flash('messageDelete');
	res.locals.errorMessage = req.flash('errorMessage');
	res.locals.errorValidation = req.flash('errorValidation');
	// console.log("AL INICIO ", req.session.rolAdmin)
	// res.locals.rolAdmin = req.session.rolAdmin;
	// res.locals.error_msg_exist =  req.session.error_msg_exist;
	// res.locals.ruta =  req.session.ruta;
	// res.locals.rol =  req.session.rol;
	// res.locals.loggedIn =  req.session.loggedin;
	// res.locals.userName =  req.session.username;
	// res.locals.userMail =  req.session.usermail;
	next();
});

// Capturar los datos de formularios.
app.use(express.urlencoded({ extended: true })); // aceptar datos del formulario (extended : false), solo acepta text
app.use(express.json()); // recibir JSON
app.use(bodyParser.json());

//4 - Recursos Publicos
app.use(express.static(path.join(__dirname,'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use('/style', express.static(__dirname + '/public/css'));
app.use('/image', express.static(__dirname + '/public/img'));
app.use('/scripts', express.static(__dirname + '/public/js'));

// 5 - Establecer Motor de plantilla
app.engine('.hbs', exphbs.engine({
	defaultLayout: 'main', //PARTES DE LA APP { FOOTER, BODY, HEAD}
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'), // REUTILIZAR CODIGO EN LAS VISTAS
	formsDir: path.join(app.get('views'), 'forms'), // REUTILIZAR CODIGO EN LAS VISTAS
	// profileDir: path.join(app.get('views'), 'profile'), // REUTILIZAR CODIGO EN LAS VISTAS
	// workspaceDir: path.join(app.get('views'), 'workspace'), // REUTILIZAR CODIGO EN LAS VISTAS
	// formDir: path.join(app.get('tables')), // REUTILIZAR CODIGO EN LAS VISTAS
	extname: '.hbs',
	//helpers: require('./lib/handlebars') // EJECUTAR FUNCIONES
}))
app.set('view engine', '.hbs'); // EJECUTAR NUESTRO MOTOR HBS

// Creamos usuario inicial
// const userDef = require('../src/routes/db/userDefault');
// userDef();

// Starting the server
app.listen(PORT, () => {
	console.log(`Server is in port , ${PORT}`, `http://localhost:${PORT}`);
});

// 9 - ROUTERS
app.use('/', require('./routes/IndexRouter')); // PAGINA PRICIPAL
app.use('/profile', require('./routes/profile/ProfileRouter'));
app.use('/workspace', require('./routes/workspace/WorkspaceRouter'));
app.use('/workspace/partners', require('./routes/workspace/PartnersRouter'));

// 9.1 - ROUTERS API
app.use('/api/books', require('./routes/api/BookRouter'))
app.use('/api/bookings', require('./routes/api/BookingRouter'))
app.use('/api/partners', require('./routes/api/PartnerRouter'))
app.use('/api/votes', require('./routes/api/VoteRouter'))

// 9.2 - ROUTES AUTH
app.use('/login', require('./routes/authentication/LoginRouter'))
app.use('/logout', require('./routes/authentication/LogoutRouter'))
app.use('/reset', require('./routes/authentication/ResetRouter'))
app.use('/register', require('./routes/authentication/RegisterRouter'))

app.use(function(req, res){
	res.render('error_page/404')
})