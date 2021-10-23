'use strict';

var express = require('express');
var api = express.Router();
var ProductoController = require('../controllers/producto');
var md_auth = require('../middlewares/authenticated');

api.post('/save-producto/:idEmpresa', md_auth.ensureAuth, ProductoController.saveProducto);
//listad los productos de todas las empresas
api.get('/get-productos-empresas/:page?', ProductoController.getProductosEmpresas);

//listad los productos de una las empresas
api.get('/get-productos-empresa/:idEmpresa', md_auth.ensureAuth, ProductoController.getProductosEmpresa);

api.put('/update-producto-empresa/:idEmpresa/:idProducto', md_auth.ensureAuth, ProductoController.updateProducto);
module.exports = api;