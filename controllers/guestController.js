/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var Film = require('../models/Film');

router.get(['/', '/index'], function(req, res) {
    //affiche index.html
    Film.find({}).sort('-dateSortie').exec(function(err, films) {
        console.log(films);
        res.render('index.html', {films : films});
    });
});

router.get(['/popular'], function(req, res) {
    //affiche popular.html

});

router.get(['/film/:id'], function(req, res) {
   //affiche detail.html
    var idFilm = req.params.id;

    Film.findById(idFilm).populate('avis').exec(function(err, film) {
        res.render('detail.html', { film: film});
    });
});

module.exports = router ;
