'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://samuel:chamuco2001_@api-rest-pqs.yw4k1.mongodb.net/api-rest-pqs?retryWrites=true&w=majority')
    .then(() => {
        console.log('Conexion a la base de datos de PA_QUE_SEPAS se realizo correctamente');

        //creamos el servidor
        app.listen(port, () => {
            console.log('SERVIDOR CREADO Y CORRIENDO EN http://localhost:3800');
        });

    }).catch(err => console.log(err));