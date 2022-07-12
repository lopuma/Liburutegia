const express = require('express');
const router = express.Router();

// SINGIN
router.get('/login', async (req, res) => {
    res.render('links/login');
});
router.post('/login', async (req, res) => {
    const email = req.body.email;
    res.redirect('/dashboard');
});

// SIGNUP
// router.get("/signup", renderSignUp);
// router.post("/signup", signUp);

// LOGOUTH
//router.get("/logout", logout);

module.exports = router;