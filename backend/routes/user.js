// Importation express qui va servir a faire le routage
const express = require('express');
const router = express.Router();

// Importation  controllers qui vont servir a la declaration des routes
const userCtrl = require('../controllers/user');

// Declaration des routes 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation des routes
module.exports = router;