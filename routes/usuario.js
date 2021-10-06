'use strict';

var express = require('express');
var api = express.Router();
var UsuarioController = require('../controllers/usuario');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/usuarios' });

api.post('/registrar', UsuarioController.crearUsuario);
api.post('/login', UsuarioController.loginUsuario);

api.get('/home', md_auth.ensureAuth, UsuarioController.home);
api.get('/usuario/:id', md_auth.ensureAuth, UsuarioController.getUsuario);
api.get('/usuarios/:page?', md_auth.ensureAuth, UsuarioController.getUsuarios);
api.put('/update-usuario', md_auth.ensureAuth, UsuarioController.updateUsuario);
api.post('/update-imagen-usuario/:id', [md_auth.ensureAuth, md_upload], UsuarioController.uploadImagen);
api.get('/get-imagen-usuario/:imagenFile', UsuarioController.getImagenFile);

module.exports = api;
