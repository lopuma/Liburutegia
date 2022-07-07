const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https")

// initializations
const app = express();

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname)
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global Variables
app.use((req, res, next) =>{
  next()
});

// Routers
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


// Public 
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
// https.createServer({
//   cert: fs.readFileSync('liburudenda-selfsigned.crt'),
//   key: fs.readFileSync('liburudenda-selfsigned.key')
// }, app).listen(app.get('port'), () => {
//   console.log('Server is in port', app.get('port'));
// });

app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

