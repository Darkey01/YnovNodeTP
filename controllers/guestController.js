/**
 * Created by Reynald on 13/01/2017.
 */
var router = require('express').Router();

router.get(['/', '/index'], function(req, res) {
    //affiche index.html
});

router.get(['/popular'], function(req, res) {
    //affiche popular.html
});

router.get(['/film/:id'], function(req, res) {
    //affiche detail.html
});

module.exports = router ;