/**
 * Created by Reynald on 13/01/2017.
 */
var db = require('../config/db');
var Avis = require('./Film');

var Schema = db.Schema;

var filmSchema = new Schema({
    titre: 'String',
    realisateur: 'String',
    affiche : 'String',
    dateSortie : 'Date',
    dateUpload : 'Date',
    sypnosis : 'String',
    avis: [{ type: Schema.Types.ObjectId, ref: 'Avis'}]
});

var Comment = db.model('Comment', filmSchema);

module.exports = Comment;