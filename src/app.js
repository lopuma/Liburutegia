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
require('dotenv').config({
    path: path.resolve(__dirname, '../env/.env')
});

console.log(process.env.NODE_ENV)
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
app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'));
console.log('');

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

// 6 - Invocamos a bscryptjs
const bscryptjs = require('bcryptjs');

// 7 - Variables de SSESSION
const session = require('express-session');
const { patch } = require('./routes/index');
const MySQLStore = require('express-mysql-session')(session);

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// 8 - Invocamos a la conexion de la DB
// const connection = require('../database/db');

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
app.use('/api', require('./routes/api/api')); // API

app.get('/flash', function(req, res){
	// Configure un mensaje flash pasando la clave, seguida del valor, a req.flash().	req.flash('info', 'Flash is back!')
	res.redirect('/login');
  });

app.use(function (req, res) {
	res.header('Content-Type', 'text/html; charset=utf-8')
	res.status(404).render('../views/error_page/404')
});

// https.createServer({
//   cert: fs.readFileSync('liburudenda-selfsigned.crt'),
//   key: fs.readFileSync('liburudenda-selfsigned.key')
// }, app).listen(app.get('port'), () => {
//   console.log('Server is running in port', app.get('port'));
// });