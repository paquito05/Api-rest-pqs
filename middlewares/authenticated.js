'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_del_proyecto_pa_que_sepas';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'la peticion no tiene cabera de autentication' });
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'El token ha expirado'});
        }

    } catch (error) {
        return res.status(404).send({message: 'El token no es valido'});
    }

    req.usuario = payload;

    next();
}