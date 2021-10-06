'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    email: String,
    nickname: String,
    password: String,
    telefono: String,
    direccion: String,
    role: String,
    imagen: String,
    estado: String 
});

module.exports = mongoose.model('Usuario', UsuarioSchema);