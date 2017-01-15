/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var Film = require('../models/Film');
var Avis = require('../models/Avis');
var Conf = require('../models/Config');
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
    Conf.find({}).exec(function (err, confs) {

        var conf = confs[0];
        if (!conf){
            conf = {
                nbFilmParPage:5
            }
        };
        Film.find({}).sort('-dateSortie').limit(conf.nbFilmParPage).exec(function (err, filmstot) {
            var nbFilm = filmstot.length;
        Film.find({}).sort('-dateSortie').limit(conf.nbFilmParPage).exec(function (err, films) {

            var nbPage = nbFilm % conf.nbFilmParPage;
            console.log(nbFilm%conf.nbFilmParPage);
            if (nbPage == 0 ) {nbPage = 1} ;
            res.render('index.html', {films: films, nbPage:nbPage  });
        });
    });
    });
});

router.get(['/:nbpage', '/index/:nbpage'], function(req, res) {
    //affiche index.html
    var laPage = req.params.nbpage;
    Conf.find({}).exec(function (err, confs) {
        var conf = confs[0];
        if (!conf){
            conf = {
                nbFilmParPage:5
            }
        };
        Film.find({}).sort('-dateSortie').skip(conf.nbFilmParPage*(laPage-1)).limit(conf.nbFilmParPage*laPage).exec(function (err, films) {
            var nbFilm = films.length;
            var nbPage = conf.nbFilmParPage % nbFilm ;
            if (nbPage == 0 ) {nbPage = 1} ;
            res.render('index.html', {films: films, nbPage:nbPage  });
        });
    });
});

router.get(['/popular'], function(req, res) {
    //affiche popular.html
    Film.find({}).sort('-moyenne').limit(3).exec(function (err, films) {
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
            var nbAvis = film.avis.length;
            film.moyenne = (((film.moyenne*(nbAvis-1))+note)/nbAvis);
            film.save(function(err, postSaved) {
                res.redirect('/film/'+idFilm);
            });
        });
    });
});

module.exports = router ;