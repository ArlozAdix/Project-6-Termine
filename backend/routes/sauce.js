// Importation express + routage
const express = require('express');
const router = express.Router();

// Auth pour l'authentification token
const auth = require('../middleware/auth');
// Multer pour la gestion d'image via le serveur
const multer = require('../middleware/multer-config');

// Importation des controllers sauce
const sauceCtrl = require('../controllers/sauce');

// Declaration des routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;