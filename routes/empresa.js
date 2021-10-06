'use strict';

var express = require('express');
var EmpresaController = require('../controllers/empresa');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/empresa', md_auth.ensureAuth, EmpresaController.saveEmpresa);
api.delete('/empresa/:id', md_auth.ensureAuth, EmpresaController.deleteEmpresa);
api.get('/empresas-usuario',md_auth.ensureAuth, EmpresaController.getEmpresas);


module.exports = api;