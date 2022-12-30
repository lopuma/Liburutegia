const mysql = require("mysql");
const { database } = require('../database/keys.js');

const connection = mysql.createConnection(database);
connection.connect(err => {
    if (err) {
        if (err.code === "ER_NOT_SUPPORTED_AUTH_MODE") {
            console.console.console.error();("Database connection was refused");
            return;
        }
    } else {
        console.info("DataBase is Connected");
    }
});

module.exports = connection;
