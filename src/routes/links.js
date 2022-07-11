const { query } = require('express');
const express = require('express');
const { link } = require('fs');
const { createPool } = require('mysql');
const router = express.Router();
const pool = require('../database');

router.post('/login', async (req, res) => {
    const email = req.body.email;
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const books = await pool.query('SELECT * from books')
    console.log(books)
    res.render('links/books', { books });
});

module.exports = router;