/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();
var Nbfilm = require('../models/Config');
var Film = require('../models/Film');

router.get(['/add'], function(req, res) {
    //affiche add.html

});

router.get(['/configuration'], function (req, res) {
    //configuration
    res.render('configuration.html');
});

router.post(['/configuration'], function(req, res){

});