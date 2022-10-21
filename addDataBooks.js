const readline = require('readline')
const fs = require('fs')
const connection = require("./database/db");

const insertBooks =  async () => {
    
    const file =  readline.createInterface(fs.createReadStream('books.csv'))

    const books = [];

    file.on("line", async (line) => {
        books.push(line.split(';'))
    })
    file.on('close', async () =>{
        await connection.query('INSERT INTO books (title, author, editorial, isbn, type, language, collection, purchase_date, observations) VALUES ?', [books])
    })
}

insertBooks()