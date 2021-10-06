'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'clave_secreta_del_proyecto_pa_que_sepas';

exports.createToken = function (usuario) {
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        nickname: usuario.nickname,
        email: usuario.email,
        role: usuario.role,
        imagen: usuario.imagen,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        estado: usuario.estado,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};