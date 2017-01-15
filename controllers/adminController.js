/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var Film = require('../models/Film');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var mime = require('mime');
var multer = require('multer');
var Conf = require('../models/Config');

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
}).single('affiche');

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

        var title = req.body.titre;
        var author = req.body.realisateur;
        var date = req.body.dateSortie;
        var synopsis = req.body.synospis;

        var film = {
            titre: title,
            realisateur: author,
            dateSortie: date,
            dateUpload: Date.now(),
            sypnosis: synopsis,
            affiche: req.file.path
        }

        var f = new Film(film);

        f.save(function (err, filmSaved) {
            res.redirect('/');
        })
    });
});



router.get(['/configuration'], function (req, res) {
    //configuration
    Conf.find({}).exec(function (err, confs) {

        var conf = confs[0];
        if (!conf) {
            conf = {
                nbFilmParPage: 5
            }
        };
        res.render('configuration.html',{ancienneVal: conf.nbFilmParPage});
    });
});

router.post(['/configuration'], parser,  function(req, res){
    var nbfilm = req.body.nbfilm;
    Conf.find({}).exec(function(err, config){
        var conf = config[0];
        if (!conf) {
            console.log('ici');
            conf = {
                nbFilmParPage: nbfilm,
                ligneConf : 1
            };
            var p = new Conf(conf);
            p.save(function (err,confsaved) {
                res.redirect("/");
            })
        }else{
            Conf.findOneAndUpdate({ligneConf: 1}, {$set:{nbFilmParPage:nbfilm}}, {new: true}, function(err, doc){
                if(err){
                    console.log("Something wrong when updating data!");
                }

                console.log(doc);
                res.redirect('/');
            });
        }});
});

module.exports = router;
