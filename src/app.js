const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

// Iniciar express
const app = express();

//3- Invocamos a dotenv
// if(process.env.NODE_ENV !== 'production'){
// 	console.log("ESTA EN PRO")
// 	require('dotenv').config();
//}
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config({
		path: path.resolve(__dirname, '../env/.env')
	});
}
console.log("1-", process.env.PORT)
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
	extname: '.hbs',
	//helpers: require('./lib/handlebars') // EJECUTAR FUNCIONES
}))
app.set('view engine', '.hbs'); // EJECUTAR NUESTRO MOTOR HBS

// Capturar los datos de formularios.
app.use(express.urlencoded({ extended: true })); // aceptar datos del formulario (extended : false), solo acepta text
app.use(express.json()); // recibir JSON

app.use(bodyParser.json());

app.use(flash()); // enviar mensajes al cliente


// 7 - Variables de SSESSION
//todo REMPLAZAMOS EXPRESS POR COOKIES
const session = require('cookie-session');
const { patch } = require('./routes/index');
//const MySQLStore = require('express-mysql-session')(session);

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// 8 - Invocamos a la conexion de la DB
// 6 - Invocamos a bscryptjs
const connection = require("../database/db");
const bscryptjs = require("bcryptjs");

// Creamos usuario inicial
const userDef = require('../src/routes/db/userDefault')
userDef();

app.use(passport.initialize());
app.use(passport.session());

// Starting the server
app.listen(PORT, () => {
	console.log(`Server is in port , ${PORT}`, `http://localhost:${PORT}`);
});

// 9 - Routers
app.use(require('./routes/index')); // PAGINA PRICIPAL
app.use(require('./routes/auth')); // RUTAS DE LOGIN
app.use('/workspace', require('./routes/workspace'));

// 9.1 ROUTERS API
app.use('/api/books', require('./routes/api/BookRouter'))
app.use('/api/bookings', require('./routes/api/BookingRouter'))
app.use('/api/partners', require('./routes/api/PartnerRouter'))
app.use('/api/votes', require('./routes/api/VoteRouter'))

app.get('/flash', function (req, res) {
	// Configure un mensaje flash pasando la clave, seguida del valor, a req.flash().	req.flash('info', 'Flash is back!')
	res.redirect('/login');
});

// app.use(function (req, res) {
// 	res.header('Content-Type', 'text/html; charset=utf-8')
// 	res.status(404).render('../views/error_page/404')
// });

// https.createServer({
//   cert: fs.readFileSync('liburudenda-selfsigned.crt'),
//   key: fs.readFileSync('liburudenda-selfsigned.key')
// }, app).listen(app.get('port'), () => {
//   console.log('Server is running in port', app.get('port'));
// });