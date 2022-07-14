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
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global Variables
app.use((req, res, next) =>{
  next();
  console.log("cuando se llama a NEXT")
});

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});

//4 - Recursos Publicos
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

// 8 - Invocamos a la conexion de la DB
const connection = require('../database/db');
const { data } = require('jquery');

// 9 - Routers
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));

app.get('/dashboard-partners', async (req, res) => {
  const name = req.session.name;
  res.render('links/dashboard-partners', { name });
});

app.get('/dashboard-bookings', async (req, res) => {
	const name = req.session.name;
	const logueado = req.session.loggedin;
	console.log("LOGUEDO VAL ", logueado);
    let url = '/api/books'
    if(logueado && name){
        const books = await url;
        res.render('links/dashboard-bookings', {
        login: true,
        name: req.session.name,
        books, 
      });
    }else{
        res.render('links/login',{
            login: false,
            name: ''
        });
    }
  });;

  app.post('/edit', async (req, res) => {
    const email = req.books;
	console.log(email)
    res.redirect('/dashboard');
});;

// ROUTERS API
app.get('/api/books', async (req, res) => {
	const books = await connection.query('SELECT * from books')
	var data = JSON.stringify({
		"data": books
	});
	res.send(data);
  });

  app.get('/api/bookings', async (req, res) => {
	const bookings = await connection.query('SELECT r.id_booking,l.id_book, l.titulo, s.dni, s.nombre, s.apellidos, r.fecha_reserva, r.fecha_entrega FROM books l, bookings r, partners s WHERE l.id_book = r.cod_book AND s.dni = r.dni_partner')
	var data = JSON.stringify({
		"data": bookings
	});
	console.log("TIPO ES *BOOKINGS*", typeof(data));
	res.send(data);
  });

  app.get('/api/objects', async (req, res) => {
	const books = `{
		"data": [
		  {
			"id": "1",
			"name": "Tiger Nixon",
			"position": "System Architect",
			"salary": "$320,800",
			"start_date": "2011/04/25",
			"office": "Edinburgh",
			"extn": "5421"
		  },
		  {
			"id": "2",
			"name": "Garrett Winters",
			"position": "Accountant",
			"salary": "$170,750",
			"start_date": "2011/07/25",
			"office": "Tokyo",
			"extn": "8422"
		  },
		  {
			"id": "3",
			"name": "Ashton Cox",
			"position": "Junior Technical Author",
			"salary": "$86,000",
			"start_date": "2009/01/12",
			"office": "San Francisco",
			"extn": "1562"
		  },
		  {
			"id": "4",
			"name": "Cedric Kelly",
			"position": "Senior Javascript Developer",
			"salary": "$433,060",
			"start_date": "2012/03/29",
			"office": "Edinburgh",
			"extn": "6224"
		  },
		  {
			"id": "5",
			"name": "Airi Satou",
			"position": "Accountant",
			"salary": "$162,700",
			"start_date": "2008/11/28",
			"office": "Tokyo",
			"extn": "5407"
		  },
		  {
			"id": "6",
			"name": "Brielle Williamson",
			"position": "Integration Specialist",
			"salary": "$372,000",
			"start_date": "2012/12/02",
			"office": "New York",
			"extn": "4804"
		  },
		  {
			"id": "7",
			"name": "Herrod Chandler",
			"position": "Sales Assistant",
			"salary": "$137,500",
			"start_date": "2012/08/06",
			"office": "San Francisco",
			"extn": "9608"
		  },
		  {
			"id": "8",
			"name": "Rhona Davidson",
			"position": "Integration Specialist",
			"salary": "$327,900",
			"start_date": "2010/10/14",
			"office": "Tokyo",
			"extn": "6200"
		  },
		  {
			"id": "9",
			"name": "Colleen Hurst",
			"position": "Javascript Developer",
			"salary": "$205,500",
			"start_date": "2009/09/15",
			"office": "San Francisco",
			"extn": "2360"
		  },
		  {
			"id": "10",
			"name": "Sonya Frost",
			"position": "Software Engineer",
			"salary": "$103,600",
			"start_date": "2008/12/13",
			"office": "Edinburgh",
			"extn": "1667"
		  },
		  {
			"id": "11",
			"name": "Jena Gaines",
			"position": "Office Manager",
			"salary": "$90,560",
			"start_date": "2008/12/19",
			"office": "London",
			"extn": "3814"
		  },
		  {
			"id": "12",
			"name": "Quinn Flynn",
			"position": "Support Lead",
			"salary": "$342,000",
			"start_date": "2013/03/03",
			"office": "Edinburgh",
			"extn": "9497"
		  },
		  {
			"id": "13",
			"name": "Charde Marshall",
			"position": "Regional Director",
			"salary": "$470,600",
			"start_date": "2008/10/16",
			"office": "San Francisco",
			"extn": "6741"
		  },
		  {
			"id": "14",
			"name": "Haley Kennedy",
			"position": "Senior Marketing Designer",
			"salary": "$313,500",
			"start_date": "2012/12/18",
			"office": "London",
			"extn": "3597"
		  },
		  {
			"id": "15",
			"name": "Tatyana Fitzpatrick",
			"position": "Regional Director",
			"salary": "$385,750",
			"start_date": "2010/03/17",
			"office": "London",
			"extn": "1965"
		  },
		  {
			"id": "16",
			"name": "Michael Silva",
			"position": "Marketing Designer",
			"salary": "$198,500",
			"start_date": "2012/11/27",
			"office": "London",
			"extn": "1581"
		  },
		  {
			"id": "17",
			"name": "Paul Byrd",
			"position": "Chief Financial Officer (CFO)",
			"salary": "$725,000",
			"start_date": "2010/06/09",
			"office": "New York",
			"extn": "3059"
		  },
		  {
			"id": "18",
			"name": "Gloria Little",
			"position": "Systems Administrator",
			"salary": "$237,500",
			"start_date": "2009/04/10",
			"office": "New York",
			"extn": "1721"
		  },
		  {
			"id": "19",
			"name": "Bradley Greer",
			"position": "Software Engineer",
			"salary": "$132,000",
			"start_date": "2012/10/13",
			"office": "London",
			"extn": "2558"
		  },
		  {
			"id": "20",
			"name": "Dai Rios",
			"position": "Personnel Lead",
			"salary": "$217,500",
			"start_date": "2012/09/26",
			"office": "Edinburgh",
			"extn": "2290"
		  },
		  {
			"id": "21",
			"name": "Jenette Caldwell",
			"position": "Development Lead",
			"salary": "$345,000",
			"start_date": "2011/09/03",
			"office": "New York",
			"extn": "1937"
		  },
		  {
			"id": "22",
			"name": "Yuri Berry",
			"position": "Chief Marketing Officer (CMO)",
			"salary": "$675,000",
			"start_date": "2009/06/25",
			"office": "New York",
			"extn": "6154"
		  },
		  {
			"id": "23",
			"name": "Caesar Vance",
			"position": "Pre-Sales Support",
			"salary": "$106,450",
			"start_date": "2011/12/12",
			"office": "New York",
			"extn": "8330"
		  },
		  {
			"id": "24",
			"name": "Doris Wilder",
			"position": "Sales Assistant",
			"salary": "$85,600",
			"start_date": "2010/09/20",
			"office": "Sydney",
			"extn": "3023"
		  },
		  {
			"id": "25",
			"name": "Angelica Ramos",
			"position": "Chief Executive Officer (CEO)",
			"salary": "$1,200,000",
			"start_date": "2009/10/09",
			"office": "London",
			"extn": "5797"
		  },
		  {
			"id": "26",
			"name": "Gavin Joyce",
			"position": "Developer",
			"salary": "$92,575",
			"start_date": "2010/12/22",
			"office": "Edinburgh",
			"extn": "8822"
		  },
		  {
			"id": "27",
			"name": "Jennifer Chang",
			"position": "Regional Director",
			"salary": "$357,650",
			"start_date": "2010/11/14",
			"office": "Singapore",
			"extn": "9239"
		  },
		  {
			"id": "28",
			"name": "Brenden Wagner",
			"position": "Software Engineer",
			"salary": "$206,850",
			"start_date": "2011/06/07",
			"office": "San Francisco",
			"extn": "1314"
		  },
		  {
			"id": "29",
			"name": "Fiona Green",
			"position": "Chief Operating Officer (COO)",
			"salary": "$850,000",
			"start_date": "2010/03/11",
			"office": "San Francisco",
			"extn": "2947"
		  },
		  {
			"id": "30",
			"name": "Shou Itou",
			"position": "Regional Marketing",
			"salary": "$163,000",
			"start_date": "2011/08/14",
			"office": "Tokyo",
			"extn": "8899"
		  },
		  {
			"id": "31",
			"name": "Michelle House",
			"position": "Integration Specialist",
			"salary": "$95,400",
			"start_date": "2011/06/02",
			"office": "Sydney",
			"extn": "2769"
		  },
		  {
			"id": "32",
			"name": "Suki Burks",
			"position": "Developer",
			"salary": "$114,500",
			"start_date": "2009/10/22",
			"office": "London",
			"extn": "6832"
		  },
		  {
			"id": "33",
			"name": "Prescott Bartlett",
			"position": "Technical Author",
			"salary": "$145,000",
			"start_date": "2011/05/07",
			"office": "London",
			"extn": "3606"
		  },
		  {
			"id": "34",
			"name": "Gavin Cortez",
			"position": "Team Leader",
			"salary": "$235,500",
			"start_date": "2008/10/26",
			"office": "San Francisco",
			"extn": "2860"
		  },
		  {
			"id": "35",
			"name": "Martena Mccray",
			"position": "Post-Sales support",
			"salary": "$324,050",
			"start_date": "2011/03/09",
			"office": "Edinburgh",
			"extn": "8240"
		  },
		  {
			"id": "36",
			"name": "Unity Butler",
			"position": "Marketing Designer",
			"salary": "$85,675",
			"start_date": "2009/12/09",
			"office": "San Francisco",
			"extn": "5384"
		  },
		  {
			"id": "37",
			"name": "Howard Hatfield",
			"position": "Office Manager",
			"salary": "$164,500",
			"start_date": "2008/12/16",
			"office": "San Francisco",
			"extn": "7031"
		  },
		  {
			"id": "38",
			"name": "Hope Fuentes",
			"position": "Secretary",
			"salary": "$109,850",
			"start_date": "2010/02/12",
			"office": "San Francisco",
			"extn": "6318"
		  },
		  {
			"id": "39",
			"name": "Vivian Harrell",
			"position": "Financial Controller",
			"salary": "$452,500",
			"start_date": "2009/02/14",
			"office": "San Francisco",
			"extn": "9422"
		  },
		  {
			"id": "40",
			"name": "Timothy Mooney",
			"position": "Office Manager",
			"salary": "$136,200",
			"start_date": "2008/12/11",
			"office": "London",
			"extn": "7580"
		  },
		  {
			"id": "41",
			"name": "Jackson Bradshaw",
			"position": "Director",
			"salary": "$645,750",
			"start_date": "2008/09/26",
			"office": "New York",
			"extn": "1042"
		  },
		  {
			"id": "42",
			"name": "Olivia Liang",
			"position": "Support Engineer",
			"salary": "$234,500",
			"start_date": "2011/02/03",
			"office": "Singapore",
			"extn": "2120"
		  },
		  {
			"id": "43",
			"name": "Bruno Nash",
			"position": "Software Engineer",
			"salary": "$163,500",
			"start_date": "2011/05/03",
			"office": "London",
			"extn": "6222"
		  },
		  {
			"id": "44",
			"name": "Sakura Yamamoto",
			"position": "Support Engineer",
			"salary": "$139,575",
			"start_date": "2009/08/19",
			"office": "Tokyo",
			"extn": "9383"
		  },
		  {
			"id": "45",
			"name": "Thor Walton",
			"position": "Developer",
			"salary": "$98,540",
			"start_date": "2013/08/11",
			"office": "New York",
			"extn": "8327"
		  },
		  {
			"id": "46",
			"name": "Finn Camacho",
			"position": "Support Engineer",
			"salary": "$87,500",
			"start_date": "2009/07/07",
			"office": "San Francisco",
			"extn": "2927"
		  },
		  {
			"id": "47",
			"name": "Serge Baldwin",
			"position": "Data Coordinator",
			"salary": "$138,575",
			"start_date": "2012/04/09",
			"office": "Singapore",
			"extn": "8352"
		  },
		  {
			"id": "48",
			"name": "Zenaida Frank",
			"position": "Software Engineer",
			"salary": "$125,250",
			"start_date": "2010/01/04",
			"office": "New York",
			"extn": "7439"
		  },
		  {
			"id": "49",
			"name": "Zorita Serrano",
			"position": "Software Engineer",
			"salary": "$115,000",
			"start_date": "2012/06/01",
			"office": "San Francisco",
			"extn": "4389"
		  },
		  {
			"id": "50",
			"name": "Jennifer Acosta",
			"position": "Junior Javascript Developer",
			"salary": "$75,650",
			"start_date": "2013/02/01",
			"office": "Edinburgh",
			"extn": "3431"
		  },
		  {
			"id": "51",
			"name": "Cara Stevens",
			"position": "Sales Assistant",
			"salary": "$145,600",
			"start_date": "2011/12/06",
			"office": "New York",
			"extn": "3990"
		  },
		  {
			"id": "52",
			"name": "Hermione Butler",
			"position": "Regional Director",
			"salary": "$356,250",
			"start_date": "2011/03/21",
			"office": "London",
			"extn": "1016"
		  },
		  {
			"id": "53",
			"name": "Lael Greer",
			"position": "Systems Administrator",
			"salary": "$103,500",
			"start_date": "2009/02/27",
			"office": "London",
			"extn": "6733"
		  },
		  {
			"id": "54",
			"name": "Jonas Alexander",
			"position": "Developer",
			"salary": "$86,500",
			"start_date": "2010/07/14",
			"office": "San Francisco",
			"extn": "8196"
		  },
		  {
			"id": "55",
			"name": "Shad Decker",
			"position": "Regional Director",
			"salary": "$183,000",
			"start_date": "2008/11/13",
			"office": "Edinburgh",
			"extn": "6373"
		  },
		  {
			"id": "56",
			"name": "Michael Bruce",
			"position": "Javascript Developer",
			"salary": "$183,000",
			"start_date": "2011/06/27",
			"office": "Singapore",
			"extn": "5384"
		  },
		  {
			"id": "57",
			"name": "Donna Snider",
			"position": "Customer Support",
			"salary": "$112,000",
			"start_date": "2011/01/25",
			"office": "New York",
			"extn": "4226"
		  }
		]
	  }`;
	console.log("TIPO ES *OBJETS*", typeof(books));
	res.send(books);
  });

  app.put('/api/books/:id_book', (req, res) => {
	id_book = req.params.id_book
	titulo = req.body.titulo
	autor = req.body.autor
	tipo = req.body.tipo
	idioma = req.body.idioma
	console.log(id_book, titulo, idioma)
	let sql = "UPDATE books SET titulo = ?, autor = ?, tipo = ?, idioma = ? WHERE id_book = ?";
	connection.query(sql, [titulo, autor, tipo, idioma, id_book], function(error, result){
		if(error){
			throw error;
		}else{
			res.send(result);
		}
	})
  });

// app.post('/login', async (req, res)=> {
// 	res.render('links/login');
// });


//11 - Metodo para la autenticacion
// app.post('/auth', async (req, res)=> {
// 	const email = req.body.email;
// 	const pass = req.body.pass;    
//   //let passwordHash = await bcrypt.hash(pass, 8);
// 	if (email && pass) {
// 		connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
// 			if( results.length == 0 || await pass != results[0].pass ) {    
// 				res.redirect('/login');
// 				} else {         
// 				//creamos una var de session y le asignamos true si INICIO SESSION 
// 				req.session.loggedin = true;                
// 				req.session.name = results[0].firtname;
//         const alerta = {
// 					alert: true,
// 					alertTitle: "Conexión exitosa",
// 					alertMessage: "¡LOGIN CORRECTO!",
// 					alertIcon:'success',
// 					showConfirmButton: false,
// 					timer: 1500,
// 					ruta: ''
// 				};
// 				res.redirect('/dashboard');        			
// 			}			
// 			res.end();
// 		});
// 	} else {	
// 		res.send('Please enter user and Password!');
// 		res.end();
// 	}
// });

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
  console.log('Server is in port', app.get('port'), );
});

// Starting the server
// https.createServer({
//   cert: fs.readFileSync('liburudenda-selfsigned.crt'),
//   key: fs.readFileSync('liburudenda-selfsigned.key')
// }, app).listen(app.get('port'), () => {
//   console.log('Server is running in port', app.get('port'));
// });