const passport = require('passport'); // loguear y guardar session
const localStrategy = require('passport-local').Strategy; // con la BD
const connection = require('../../database/db')

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {

    //confirmar si existe el correo
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
            if( results.length == 0 ) {
                    // console.log("*----------------------------------------*")
                    // req.session.loggedin = false;
                    // nameUser = ''
                    // login = false
                    // res.render("index")
                    return done(null, false, {message: 'no existe el usuario'})
                } else {
                    //creamos una var de session y le asignamos true si INICIO SESSION
                    console.log('EXISTE')
                    return done(null, 'lopuma')
            }
        });

}));
