const mysql = require("mysql2");
const { database } = require('./db-keys.js');
const connection = mysql.createConnection(database);
const _log = require('../../src/utils');

connection.connect(err => {
    if (err) {
        if (err.code === "ER_NOT_SUPPORTED_AUTH_MODE") {
            _log.error("Database connection was refused");
            return;
        }
        console.error(err);
    } else {
        _log.ready(`server DataBase is connected on ${database.host} the PORT: ${database.port}`);
    }
});

module.exports = connection;
