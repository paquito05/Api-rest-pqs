'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PedidoSchema = Schema({
    fecha: String,  
    cantidad: Int8Array,
    descripcion: String,
    total: Float32Array,
    estado: String,
    usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    producto: { type: Schema.ObjectId, ref: 'Producto' },
    empresa: { type: Schema.ObjectId, ref: 'Empresa' }

});

module.exports = mongoose.model('Pedido', PedidoSchema);