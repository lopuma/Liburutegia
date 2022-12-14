const readline = require('readline')
const fs = require('fs')
const connection = require("../database/db");

const insertBooks = async () => {

    const file = readline.createInterface(fs.createReadStream('nuevo.csv'))

    const books = [];

    file.on("line", async line => {
        /*datePush = line.split(";")[7];
        let hoy = new Date(datePush);
        dia = hoy.getDate();
        mes = hoy.getMonth();
        anio = hoy.getFullYear();
        fecha_actual = String(anio + "-" + (mes + 1) + "-" + dia);
        fs.appendFile(
            "nuevo.csv",
            `${line.split(";")[0]};
            ${line.split(";")[1]};
            ${line.split(";")[2]};
            ${line.split(";")[3]};
            ${line.split(";")[4]};
            ${line.split(";")[5]};
            ${line.split(";")[6]};
            ${fecha_actual};
            ${line.split(";")[8]}\n`,
            () => {}
        );*/
        books.push(line.split(';'))
    });

    file.on('close', async () =>{
        await connection.query('INSERT INTO books (title, author, editorial, isbn, type, language, collection, purchase_date, observations) VALUES ?', [books])
    })
}

insertBooks()