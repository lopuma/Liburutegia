const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
// const passport = require('passport');
const flash = require('connect-flash');
//const bodyParser = require('body-parser');

//PARA HTTPS
// const https = require('https')
// const fs = require('fs')

// Iniciar express
const app = express();

//3- Invocamos a dotenv
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config({
		path: path.resolve(__dirname, '../env/.env')
	});
}

// Configuraciones
const PORT = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));

// Middlewares - mostrar las peticiones por consola
app.use(morgan('dev'));

// Global Variables - MILDEWER
app.use((req, res, next) => {
	next();
});

//4 - Recursos Publicos
app.use('/style', express.static(__dirname + '/public/css'));
app.use('/image', express.static(__dirname + '/public/img'));
app.use('/scripts', express.static(__dirname + '/public/js'));

// 5 - Establecer Motor de plantilla
app.engine('.hbs', exphbs.engine({
	defaultLayout: 'main', //PARTES DE LA APP { FOOTER, BODY, HEAD}
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'), // REUTILIZAR CODIGO EN LAS VISTAS
	formsDir: path.join(app.get('views'), 'forms'), // REUTILIZAR CODIGO EN LAS VISTAS
	extname: '.hbs',
	//helpers: require('./lib/handlebars') // EJECUTAR FUNCIONES
}))
app.set('view engine', '.hbs'); // EJECUTAR NUESTRO MOTOR HBS

// Capturar los datos de formularios.
app.use(express.urlencoded({ extended: true })); // aceptar datos del formulario (extended : false), solo acepta text
app.use(express.json()); // recibir JSON
//app.use(bodyParser.json());

app.use(flash()); // enviar mensajes al cliente

// const { patch } = require('./routes/index');
//const MySQLStore = require('express-mysql-session')(session);

// 7 - Variables de SSESSION
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	//maxAge: 0.1 * 60 * 60 * 1000
}));

// 8 - Invocamos a la conexion de la DB
const connection = require("../database/db");
// 6 - Invocamos a bscryptjs
const bscryptjs = require("bcryptjs");

// Creamos usuario inicial
const userDef = require('../src/routes/db/userDefault')
userDef();

// app.use(passport.initialize());
// app.use(passport.session());

// Starting the server
app.listen(PORT, () => {
	console.log(`Server is in port , ${PORT}`, `http://localhost:${PORT}`);
});

// 9 - Routers
app.use(require('./routes/index')); // PAGINA PRICIPAL
app.use('/workspace', require('./routes/workspace'));

// 9.1 ROUTERS API
app.use('/api/books', require('./routes/api/BookRouter'))
app.use('/api/bookings', require('./routes/api/BookingRouter'))
app.use('/api/partners', require('./routes/api/PartnerRouter'))
app.use('/api/votes', require('./routes/api/VoteRouter'))

// 9.2 ROUTES AUTH
app.use('/login', require('./routes/authentication/LoginRouter'))
app.use('/logout', require('./routes/authentication/LogoutRouter'))
//app.use('/reset', require('./routes/authentication/ResetRouter'))