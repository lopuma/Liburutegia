const { query } = require('express');
const express = require('express');
const { link } = require('fs');
const { createPool } = require('mysql');
const router = express.Router();
const connection = require('../../database/db');
const session = require('express-session')

router.get('/', async (req, res) => {
    const books = await connection.query('SELECT * from books')
    const name = req.session.name;
    res.render('links/dashboard-books', { books, name });
});

module.exports = router;