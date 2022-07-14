
const mysql = require('mysql');
const { promisify }= require('util');
const { database } = require('./keys');
const connection = mysql.createPool(database);

connection.getConnection((err, res) => {
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

  if (connection) res.release();
  console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
connection.query = promisify(connection.query);

module.exports = connection;