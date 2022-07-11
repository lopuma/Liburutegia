// //2 - Invocamos a MySQL y realizamos la conexion
// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     //Con variables de entorno
//     host     : process.env.DB_HOST,
//     user     : process.env.DB_USER,
//     password : process.env.DB_PASS,
//     database : process.env.DB_DATABASE
// });

// connection.connect((error)=>{
//     if (error) {
//       console.error('El error de conexión es: ' + error);
//       return;
//     }
//     console.log('¡Conectado a la Base de Datos!');
//   });

//   module.exports = connection;

const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;