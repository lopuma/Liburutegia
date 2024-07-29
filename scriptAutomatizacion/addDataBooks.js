const fs = require('fs').promises;
const mysql = require('mysql2/promise');

const insertBooks = async () => {
    try {
        const data = await fs.readFile('nuevo2.csv', 'utf8');
        const books = data.split('\n').map(line => line.split(';'));
        console.log(books)
        const connection = await mysql.createConnection({
            host: '192.168.1.17',
            user: 'root',
            password: 'Dopracau4000lopo',
            database: 'oargi'
        });

        try {
            // INSERT en la base de datos
            await connection.query('INSERT INTO partners (lastname, name, direction, partnerNumber, phone1, entryDate, paymentDate) VALUES ?', [books]);
            console.log('Datos insertados correctamente.');
        } catch (error) {
            console.error('Error al insertar datos:', error);
        } finally {
            // Cerrar la conexión después de realizar la consulta
            await connection.end();
        }
    } catch (error) {
        console.error('Error al leer el archivo:', error);
    }
};

insertBooks();