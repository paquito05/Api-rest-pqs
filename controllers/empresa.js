'use strict';

//var path = require('path');
//var fs= require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Usuario = require('../models/usuario');
var Empresa = require('../models/empresa');


//crear una empresa
function saveEmpresa(req, res) {

    var params = req.body;
    var empresa = new Empresa();

    if (params.nombre && params.d_identidad && params.provincia && params.distrito && params.direccion && params.rol) {

        empresa.nombre = params.nombre;
        empresa.d_identidad = params.d_identidad;
        empresa.provincia = params.provincia;
        empresa.distrito = params.distrito;
        empresa.direccion = params.direccion;
        empresa.rol = params.rol;
        empresa.imagen = null;
        empresa.estado = '0';
        empresa.razon_social = null;
        empresa.l_funcionamiento = null;

        empresa.usuario = req.usuario.sub;


        empresa.save((err, empresaStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar la empresa' });

            if (empresaStored) {
                res.status(200).send({ empresa: empresaStored });
            } else {
                res.status(404).send({ message: 'no se ha registrado la empresa' });
            }
        });

    } else {
        res.status(404).send({
            message: 'Envia todos los campos necesarios'
        });
    }

}


//elimina la empresa
function deleteEmpresa(req, res) {
    var userId = req.usuario.sub;
    var empresaId = req.params.id;

    Empresa.find({ 'usuario': userId, '_id': empresaId }).deleteOne((err, empresaRemoved) => {
        if (err) return res.status(500).send({ message: 'Error al borrar la empresa' });

        if (empresaRemoved.deletedCount == 0) {
            return res.status(404).send({ message: 'no se ha borrado la empresa' });
        } else {
            return res.status(200).send({ message: 'se ha borrado la empresa correctamente' });
        }
    });
}


//lista la empresa del usuario de manera paginada 

function getEmpresas(req, res) {
    var userId = req.usuario.sub;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 6;

    Empresa.find({ usuario: userId }).populate({ path: 'usuario' }).paginate(page, itemsPerPage, (err, empresas, total) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (!empresas) return res.status(404).send({ message: 'No te tiene ninguan empresa con este usuario' });

        empresas.password = undefined;
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            empresas
        });

    });

}

module.exports = {
    saveEmpresa,
    deleteEmpresa,
    getEmpresas
}