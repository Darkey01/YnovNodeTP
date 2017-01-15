/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var Film = require('../models/Film');
var Avis = require('../models/Avis');
var multer = require('multer');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var mime = require('mime');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/imgs');
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(err, raw.toString('hex') + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        var extensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
        var ext = mime.extension(file.mimetype);
        if(extensions.indexOf(ext) != -1) {
            cb(null, true);
        }else {
            cb(new Error('Fichier incorrect'));
        }
    }
}).single('picture');

var parser = bodyParser.urlencoded({extended: false});

router.get(['/', '/index'], function(req, res) {
    //affiche index.html
    Film.find({}).sort('-dateSortie').exec(function(err, films) {
        console.log(films);
        res.render('index.html', {films : films});
    });
});

router.get(['/popular'], function(req, res) {
    //affiche popular.html
    Film.find({}).exec(function (err, films) {
        res.render('popular.html', {films: films});
    });
});

router.get(['/film/:id'], function(req, res) {
   //affiche detail.html
    var idFilm = req.params.id;

    Film.findById(idFilm).populate('avis').exec(function(err, film) {
        res.render('detail.html', { film: film});
    });
});

router.post('/film/:id',parser, function(req, res) {

    var idFilm = req.params.id;
    var pseudo = req.body.pseudo;
    var comment = req.body.comment;
    var note = req.body.note;

    var a = Avis({
        film: idFilm,
        pseudo: pseudo,
        avis: comment,
        note: note
    }).save(function(err, avis) {
        Film.findById(idFilm, function(err, film) {
            film.avis.push(avis.id);
            film.save(function(err, postSaved) {
                res.redirect('/film/'+idFilm);
            });
        });
    });
});

module.exports = router ;