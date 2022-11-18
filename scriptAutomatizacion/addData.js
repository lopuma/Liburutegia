const readline = require('readline')
const fs = require('fs')
const connection = require("../database/db");

const insertUser =  async () => {
    
    const file =  readline.createInterface(fs.createReadStream('partners.csv'))

    const partners = [];

    file.on("line", async (line) => {
        partners.push(line.split(';'))
    })
    file.on('close', async () =>{
        await connection.query('INSERT INTO partners (dni, scanner, name, lastname, direction, population, phone1, phone2) VALUES ?', [partners])
    })
}

insertUser()