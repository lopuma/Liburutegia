const router = require('express').Router()
const connection = require('../../../database/db');

router.get('/books', async (req, res) => {
	const books = await connection.query('SELECT * FROM books')
	var data = JSON.stringify({
		"data": books
	});
	res.send(data);
});



router.get('/partners', async (req, res) => {
	const partners = await connection.query('SELECT * FROM partners')
	var data = JSON.stringify({
		"data": partners
	});
	res.send(data);
});

router.get('/bookings', async (req, res) => {
	const bookings = await connection.query('SELECT r.id_booking,l.id_book, l.titulo, s.dni, s.nombre, s.apellidos, r.fecha_reserva, r.fecha_entrega FROM books l, bookings r, partners s WHERE l.id_book = r.cod_book AND s.dni = r.dni_partner')
	var data = JSON.stringify({
		"data": bookings
	});
	res.send(data);
});

router.put('/books/:id_book', (req, res) => {
	id_book = req.params.id_book
	titulo = req.body.title_book
	autor = req.body.author
	tipo = req.body.type
	idioma = req.body.language
	console.log("------------", id_book, titulo, idioma)
	let sql = "UPDATE books SET titulo = ?, autor = ?, tipo = ?, idioma = ? WHERE id_book = ?";
	connection.query(sql, [titulo, autor, tipo, idioma, id_book], function (error, result) {
		if (error) {
			throw error;
		} else {
			res.send(result);
		}
	})
});

router.get('/books/:id_book', (req, res) => {
	id_book = req.params.id_book;
	console.log("EL DIS RECIBIDO POR POST ES ", id_book)
	let sql = 'SELECT * FROM books WHERE id_book = ?';
	connection.query(sql, [id_book], function (error, data) {
		if (error) {
			throw error;
		} else {
			res.setHeader('Content-type', 'text/html');
			res.send(data);
			console.log(data)
		}
	})
});

router.put('/partners/:id_partner', (req, res) => {
	id_partner = req.params.id_partner
	dni = req.body.dni
	console.log("-----id_partner -----", id_partner)
	firtname = req.body.firtname
	lastname = req.body.lastname
	direction = req.body.direction
	phone = req.body.phone
	email = req.body.email
	let sql = "UPDATE partners SET nombre = ?, apellidos = ?, direccion = ?, telefono = ?, email = ? WHERE id_partner = ?";
	connection.query(sql, [firtname, lastname, direction, phone, email, id_partner], function (error, result) {
		if (error) {
			throw error;
		} else {
			res.send(result);
		}
	})
});

router.put('/bookings/:id_booking', (req, res) => {
	id_booking = req.params.id_booking
	dni = req.body.dni
	console.log("-----id_booking -----", id_booking)
	console.log("-----id_booking -----", dni)
	// let sql = "UPDATE partners SET nombre = ?, apellidos = ?, direccion = ?, telefono = ?, email = ? WHERE id_partner = ?";
	// connection.query(sql, [firtname, lastname, direction, phone, email, id_partner], function (error, result) {
	// 	if (error) {
	// 		throw error;
	// 	} else {
	// 		res.send(result);
	// 	}
	// })
});

module.exports = router;