const mysql = require('mysql');
const { database } = require('../database/keys.js');
const connection = mysql.createConnection(database);
console.log("<=== PROD ===> MYSQL_HOST ", process.env.MYSQL_HOST)    
console.log("<=== PROD ===> MYSQL_DATABASE ", process.env.MYSQL_DATABASE)    
console.log("<=== PROD ===> MYSQL_USER", process.env.MYSQL_USER)    
console.log("<=== PROD ===> MYSQL_PORT ", process.env.MYSQL_PORT)    
console.log("<=== PROD ===> MYSQL_PASSWORD ", process.env.MYSQL_PASSWORD)    
console.log("<=== PROD ===> MYSQL_ROOT_PASSWORD ", process.env.MYSQL_ROOT_PASSWORD)    
console.log("<=== PROD ===> NODE_ENV ", process.env.NODE_ENV)  
connection.connect((err) => {
  if (err) {
    if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.console.log('Database connection was refused');
      return;
    }
  }else{
    console.log('DataBase is Connected');
  }
});

module.exports = connection;