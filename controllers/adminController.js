/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var Film = require('../models/Config');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var mime = require('mime');
var multer = require('multer');


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


router.get(['/add'] , function(req, res) {
    //affiche ajout.html
    res.render('ajout.html');
});

router.post(['/add'], parser,  function(req, res){

    upload(req, res, function(err) {

        if(err) {
            return res.render('ajout.html', { error: err.message});
        }

    var title = req.body.title;
    var author = req.body.author;
    var date = req.body.date;
    var synopsis = req.body.synospis;

    var film = {
        title: title,
        author: author,
        date: date,
        synopsis: synopsis,
        picture: req.file.path
    }

    var f = new Film(film);

    f.save(function (err, filmSaved) {
        res.redirect('/');
    })
});
});



router.get(['/configuration'], function (req, res) {
    //configuration
    res.render('configuration.html');
});

router.post(['/configuration'], function(req, res){


    Nbfilm.find({}).exec(function(err, config){
        config[0].nbFilm.push(nbfilm);
        config.save(function (err , configSaved) {
            Film.find({}).sort('-dateSortie').exec(function(err, films) {
                res.render('index.html', {films : films ,nbFilm :configSaved[0].nbFilm});
            })
        })
    });
});

module.exports = router;
