/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var Film = require('../models/Film');
var Avis = require('../models/Avis');

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

router.post('/film/:id', function(req, res) {
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