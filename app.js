'use stric';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var usuario_routes = require('./routes/usuario');
var empresa_routes = require('./routes/empresa');
var producto_routes = require('./routes/producto');

//middelwares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors // configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//rutas
app.use('/api',usuario_routes);
app.use('/api',empresa_routes);
app.use('/api',producto_routes)


//Exportar
module.exports = app;