const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(allSauces => res.status(200).json(allSauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(oneSauce => res.status(200).json(oneSauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 exports.modifySauce = (req, res, next) => {
    const updateSauce = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete updateSauce._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
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

 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Non authrorise'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
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

 exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (req.body.likes == 1) {
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
            sauce.save();
        }
        if (req.body.likes == -1) {
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
            sauce.save();
        }
        if (req.body.likes == 0) {
            if (sauce.usersLiked.indexOf(req.body.userId)) {
                sauce.likes--;
                sauce.usersLiked.splice(sauce.userLiked.indexOf(req.body.userId), 1);
            }
            if (sauce.usersDisliked.indexOf(req.body.userId)) {
                sauce.dislikes--;
                sauce.usersDisliked.splice(sauce.userDisliked.indexOf(req.body.userId), 1);
            }
            sauce.save();
        }
        res.status(200).json({message: 'Changement like pris en compte'})
    })
    .catch( error => {
        res.status(500).json({ error });
    });
 };