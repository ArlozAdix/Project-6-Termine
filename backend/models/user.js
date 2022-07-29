// Importation mongoose
const mongoose = require('mongoose');

//Importation plugin pour pouvoir utiliser l'utilisation unique d'un email
const uniqueValidator = require('mongoose-unique-validator');

// Schema d'un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Utilisation du plugin sur l'email
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);