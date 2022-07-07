const express = require('express');
const router = express.Router();

// SHARK
router.get('/sharks', async (req, res) => {
    res.render('auth/sharks');
});
  
module.exports = router;