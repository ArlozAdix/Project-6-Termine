// Importaion du modele User
const User = require('../models/user');

// Importation de bcrypt pour cryptage de mot de passe
const bcrypt = require('bcrypt');

//Importation de jsonwebtoken pour la gestion de l'authentification securisee
const jwt = require('jsonwebtoken');

// Controller signup (inscription)
exports.signup = (req, res, next) => {
    // Hash du mot de passe 10 fois via bcrypt
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Creation d'un nouvel User dans la db via le modele User
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Controller login (connexion)
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
        // Verification si l'utilisateur existe
          if (!user) {
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
          }
          // Fonction compare de bcrypt, il va comparer les deux hash si ils ont ete genere depuis la meme chaine de charactere
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                  }
                  res.status(200).json({
                      userId: user._id,
                      // fonction sign de jwt (payload, chaine secrete, expiration)
                      token: jwt.sign(
                        //Gestion du token
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};