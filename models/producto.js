'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    tipo_producto: String,
    descripcion: String,
    precio: Float32Array,
    imagen: String,
    estado: String,
    empresa: { type: Schema.ObjectId, ref: 'Empresa' }
});

module.exports = mongoose.model('Producto', ProductoSchema);