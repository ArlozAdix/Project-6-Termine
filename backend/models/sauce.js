// Importation de la DB 
const mongoose = require('mongoose');

// definition du modele sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number},
  dislikes: { type: Number},
  usersLiked: { type: Array},
  usersDisliked: { type: Array}
});

//Exportation du module
module.exports = mongoose.model('Sauce', sauceSchema);