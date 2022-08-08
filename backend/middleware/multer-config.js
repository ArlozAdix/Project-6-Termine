// Importation Multer pour la gestion des images
const multer = require('multer');

// Bibliotheque de format d'images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // Defini la destination des images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Modifications des noms des fichiers images pour les rendres uniques
  filename: (req, file, callback) => {
    // Remplace les espaces par des underscores
    const name = file.originalname.split(' ').join('_');
    // Utilisations de la bibliotheque pour le definir dans le nom de fichier
    const extension = MIME_TYPES[file.mimetype];
    // Renomme le fichier en ajoutant la date pour l'unicite
    callback(null, name + Date.now() + '.' + extension);
  }
});
// Exporte le module
module.exports = multer({storage: storage}).single('image');