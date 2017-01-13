/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var nbfilm = require('../models/Config');

router.get(['/add'], function(req, res) {
    //affiche add.html

});

router.get(['/configuration'], function (req, res) {
    //configuration
    res.render('configuration.html');
});

router.post(['/configuration'], function(req, res){
    // configuration
    var nbfilm = req.body.nbfilm;

    /*var post = {
        nbligne: nbfilm
    }

    Film.findById(IdNbLigne).exec(function(err, film){
        res.render('configuration.html', { film: film})
    })*/
});