'use stric';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var usuario_routes = require('./routes/usuario');
var empresa_routes = require('./routes/empresa');

//middelwares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors

//rutas
app.use('/api',usuario_routes);
app.use('/api',empresa_routes);


//Exportar
module.exports = app;