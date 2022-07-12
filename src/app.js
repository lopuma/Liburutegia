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



// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global Variables
app.use((req, res, next) =>{
  next()
});

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});

//4 - Public
app.use('/resources', express.static('public')) 
app.use('/resources', express.static(__dirname + '/public'));

// 5 - Establecer Motor de plantilla
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

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

// Starting the server
// https.createServer({
//   cert: fs.readFileSync('liburudenda-selfsigned.crt'),
//   key: fs.readFileSync('liburudenda-selfsigned.key')
// }, app).listen(app.get('port'), () => {
//   console.log('Server is running in port', app.get('port'));
// });

// 8 - Invocamos a la conexion de la DB
const connection = require('./database');

// 9 - Routers
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));

app.get('/dashboard-partners', async (req, res) => {
  const user = "lopuma"
  res.render('links/dashboard-partners', { user });
});

//11 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
	const email = req.body.email;
	const pass = req.body.pass;    
  //let passwordHash = await bcrypt.hash(pass, 8);
	if (email && pass) {
		connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
			if( results.length == 0) {    
				res.render('/login');
				} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION 
        console.log("///////////////", results[0].firtname)     
				req.session.loggedin = true;                
				req.session.name = results[0].firtname;
        console.log("*-----------------------------*", req.session.name)
        const alerta = {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				};
				res.redirect('/dashboard');        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
		res.end();
	}
});

// 12 - Auth Pages
// app.get('/', (req, res) =>{
//   const po = req.session.loggedin;
//   console.log("------", po)
//   if(req.session.loggedin){
//     res.render('links/dashboard-books', {
//       login: true,
//       name: req.session.name
//     });
//   }else{
//     res.render('index',{
//       login: false,
//       name: ''
//     })
//   }
// });



app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

