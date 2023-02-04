const mysql = require("mysql");
const { database } = require('../database/keys.js');
console.log("Database ", database)
const connection = mysql.createConnection(database);
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
