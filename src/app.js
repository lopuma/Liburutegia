const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https")

// initializations
const app = express();
// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

// Middlewares - mostrar las peticiones por consola
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); // aceptar datos del formulario (extended : false), solo acepta text
app.use(express.json()); // recibir JSON

// Global Variables - MILDEWER
app.use((req, res, next) => {
	next();
});

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//4 - Recursos Publicos
app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'));

// 5 - Establecer Motor de plantilla
app.engine('.hbs', exphbs.engine({
	defaultLayout: 'main', //PARTES DE LA APP { FOOTER, BODY, HEAD}
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'), // REUTILIZAR CODIGO EN LAS VISTAS
	extname: '.hbs',
	helpers: require('./lib/handlebars') // EJECUTAR FUNCIONES
}))
app.set('view engine', '.hbs'); // EJECUTAR NUESTRO MOTOR HBS

// 6 - Invocamos a bscryptjs
const bscryptjs = require('bcryptjs');


// 7 - Variables de SSESSION
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// 8 - Invocamos a la conexion de la DB
const connection = require('../database/db');

// 9 - Routers
app.use(require('./routes/index')); // PAGINA PRICIPAL
app.use(require('./routes/auth')); // RUTAS DE LOGIN
app.use('/workspace', require('./routes/workspace'));
app.use(require('./public/API/api')); // API


// ROUTERS API
app.get('/api/books', async (req, res) => {
	const books = await connection.query('SELECT * FROM books')
	var data = JSON.stringify({
		"data": books
	});
	res.send(data);
});

app.get('/api/partners', async (req, res) => {
	const partners = await connection.query('SELECT * FROM partners')
	var data = JSON.stringify({
		"data": partners
	});
	res.send(data);
});

app.get('/api/bookings', async (req, res) => {
	const bookings = await connection.query('SELECT r.id_booking,l.id_book, l.titulo, s.dni, s.nombre, s.apellidos, r.fecha_reserva, r.fecha_entrega FROM books l, bookings r, partners s WHERE l.id_book = r.cod_book AND s.dni = r.dni_partner')
	var data = JSON.stringify({
		"data": bookings
	});
	res.send(data);
});

app.put('/api/books/:id_book', (req, res) => {
	id_book = req.params.id_book
	titulo = req.body.title_book
	autor = req.body.author
	tipo = req.body.type
	idioma = req.body.language
	console.log("------------", id_book, titulo, idioma)
	let sql = "UPDATE books SET titulo = ?, autor = ?, tipo = ?, idioma = ? WHERE id_book = ?";
	connection.query(sql, [titulo, autor, tipo, idioma, id_book], function (error, result) {
		if (error) {
			throw error;
		} else {
			res.send(result);
		}
	})
});

app.put('/api/partners/:id_partner', (req, res) => {
	id_partner = req.params.id_partner
	dni = req.body.dni
	console.log("-----id_partner -----", id_partner)
	firtname = req.body.firtname
	lastname = req.body.lastname
	direction = req.body.direction
	phone = req.body.phone
	email = req.body.email
	let sql = "UPDATE partners SET nombre = ?, apellidos = ?, direccion = ?, telefono = ?, email = ? WHERE id_partner = ?";
	connection.query(sql, [firtname, lastname, direction, phone, email, id_partner], function (error, result) {
		if (error) {
			throw error;
		} else {
			res.send(result);
		}
	})
});

app.use(passport.initialize());
app.use(passport.session());

// Starting the server
app.listen(app.get('port'), () => {
	console.log('Server is in port', app.get('port'), 'http://localhost:3000');
});

// https.createServer({
//   cert: fs.readFileSync('liburudenda-selfsigned.crt'),
//   key: fs.readFileSync('liburudenda-selfsigned.key')
// }, app).listen(app.get('port'), () => {
//   console.log('Server is running in port', app.get('port'));
// });