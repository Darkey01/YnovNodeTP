/**
 * Created by Ludovic TRAPEAU on 13/01/2017.
 */

var db = require('../config/db');

var Schema = db.Schema;

var configSchema = new Schema({
    nbFilmParPage: {type : 'Number' , default : '5'},
    ligneConf : 'Number'
});

var Nombre = db.model('Nombre', configSchema);

module.exports = Nombre;