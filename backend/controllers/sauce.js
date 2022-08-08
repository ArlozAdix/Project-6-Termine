// Importation modele sauce
const Sauce = require('../models/sauce');
// Importation gestion de fichier
const fs = require('fs');

// Repond avec l'ensemble des sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(allSauces => res.status(200).json(allSauces))
        .catch(error => res.status(400).json({ error }));
};

// Repond aves une seule sauce via son ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(oneSauce => res.status(200).json(oneSauce))
        .catch(error => res.status(404).json({ error }));
};


// Cree une nouvelle sauce via son modele
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // Supprime l'ID envoyee dans le body de la requete
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        // Copie le body de la requete dans New Sauce
        ...sauceObject,
        // Ajoute l'ID user avec l'authentification
        userId: req.auth.userId,
        // Ajoute l'image avec Multer
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // Initialize like & dislike a 0
        likes: 0,
        dislikes: 0
    });
    // Sauvegarde la sauce
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 // Modifie la sauce
 exports.modifySauce = (req, res, next) => {
    
    const updateSauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete updateSauce._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // Verifie si l'utilisateur modifie une de ses propres sauces
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non authorise'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...updateSauce, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 // Supprime la sauce
 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // Verifie si l'utilisateur modifie une de ses propres sauces
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Non authrorise'});
            } else {
                // Supprime el fichier image du serveur
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // Supprime la sauce via son ID
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };


 // Gestion de like de sauce
 exports.likeSauce = (req, res, next) => {
    // Trouve la sauce via ID
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        let user = req.body.userId
        // Conditions pour identifier la demande de la requete 
        if (req.body.like == 1 && !sauce.usersLiked.user) {
            // Incremente le compteur
            sauce.likes++;
            // Ajoute l'user ID dans le tableau des users ayant like
            sauce.usersLiked.push(req.body.userId);
            // Sauvegarde la sauce
            sauce.save();
        }
        if (req.body.like == -1 && !sauce.usersDisliked.user) {
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
            sauce.save();
        }
        if (req.body.like == 0) {
            // Verifi si l'utilisateur a deja vote
            if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
                // decremente le compteur
                sauce.likes--;
                // Supprime l'user ID du tableau
                sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
            }
            if (sauce.usersDisliked.indexOf(req.body.userId) != -1) {
                sauce.dislikes--;
                sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
            }
            // Sauvegarde la sauce
            sauce.save();
        }
        res.status(200).json({message: 'Changement like pris en compte'})
    })
    .catch( error => {
        res.status(500).json({ error });
    });
 };