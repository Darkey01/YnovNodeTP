/**
 * Created by Reynald on 13/01/2017.
 */
var db = require('../config/db');
var Film = require('./Film');

var Schema = db.Schema;

var avisSchema = new Schema({
    pseudo: 'String',
    avis: 'String',
    note : 'Number',
    film: { type: Schema.Types.ObjectId, ref: 'Film'}
});

var Avis = db.model('Avis', avisSchema);

module.exports = Avis;
