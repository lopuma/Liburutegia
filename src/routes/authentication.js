const express = require('express');
const router = express.Router();

// SHARK
router.get('/login', async (req, res) => {
    res.render('links/login');
});
  
module.exports = router;