const mysql = require("mysql2");
const { database } = require('../database/keys.js');
console.log("Database ", database)
const connection = mysql.createConnection('mysql://root:JmDNPu5FzQl31VtLOEgR@containers-us-west-170.railway.app:5914/railway');
connection.on('error', function(err) {
  console.log("[mysql error]",err);
});
connection.on('connect', function(result) {
  console.log("[mysql result]",result);
});
connection.connect(err => {
    if (err) {
        if (err.code === "ER_NOT_SUPPORTED_AUTH_MODE") {
            console.console.console.error();("Database connection was refused");
            return;
        }
        console.error(err);
    } else {
        console.info(`The DataBase is connected on the PORT: ${database.port}`);
    }
});

module.exports = connection;
