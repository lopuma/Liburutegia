const mysql = require('mysql');
// const { promisify }= require('util');
const { database } = require('../config');
const connection = mysql.createConnection(database);

connection.connect((err) => {
  if (err) {
    // if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    //   console.error('Database connection was closed.');
    // }
    // if (err.code === 'ER_CON_COUNT_ERROR') {
    //   console.error('Database has to many connections');
    // }
    if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.console.log();('Database connection was refused');
      return;
    }
  }
  console.log('DataBase is Connected');
});

// Promisify Pool Querys
// connection.query = promisify(connection.query);

module.exports = connection;