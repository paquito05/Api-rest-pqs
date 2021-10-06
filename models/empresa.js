'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    d_identidad: String,
    role: String,
    nombre: String,
    imagen: String,
    razon_social: String,
    l_funcionamiento: String,
    provincia: String,
    distrito: String,
    direccion: String,
    usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    estado: String

});

module.exports = mongoose.model('Empresa', EmpresaSchema);