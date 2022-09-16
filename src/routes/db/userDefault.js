
const express = require('express');
const router = express.Router();

// Invocamos a la conexion de la DB
// Invocamos a bscryptjs
const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");

async function defaultUser() {
    var sql = "SELECT IF( EXISTS(SELECT * FROM users WHERE email='admin@mail.com'), 1, 0) AS response";
    var sqlInsert = "INSERT INTO users SET ?";
    let passwordHash = await bscryptjs.hash('admin', 8);

    userDefault = {
        email:'admin@mail.com',
        firstname:'Admin',
        lastname:'Admin',
        rol:'admin',
        pass: passwordHash,
        _ss:0
    }

    connection.query(sql, async (error, results) => {
        if (error) throw error;
        exists = await results[0].response;
        if(exists != 1){
            connection.query(sqlInsert, userDefault)
            console.log(`Usuario inicial creado : ${userDefault.firstname}`)
        }else{
            console.log(`Usuario ${userDefault.firstname}, ya esta creado!!`);
        }
    });
}

module.exports = defaultUser;