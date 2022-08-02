const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const nameUser = req.session.name;
  const logueado = req.session.loggedin;
  if (logueado || nameUser) {
    res.render('workspace/dashboard-books', {
      login: true,
      nameUser,
    });
  } else {
    login: false;
    nameUser: '';
    res.render('index');
  }
});



router.post('/', (req, res) => {
  console.log(req.body);
  res.send('Data received');
})

module.exports = router;

