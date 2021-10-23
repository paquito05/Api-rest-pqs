'use strict';

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Producto = require('../models/producto');
var Empresa = require('../models/empresa');

//Guardar Producto. de la empresa
function saveProducto(req, res) {
    var userId = req.usuario.sub;
    var empresaId = req.params.idEmpresa;
    var params = req.body;
    var producto = new Producto();

    Empresa.find({ 'usuario': userId, '_id': empresaId }).populate('usuario').exec((err, empresas) => {
        if (err) return res.status(500).send({ message: 'Error al listar empresas del usuario' });

        if (!empresas) return res.status(404).send({ message: 'No te tiene ninguna empresa con este usuario' });
        console.log(empresas);
        if (empresas.length == 1) {

            if (params.nombre && params.tipo_producto && params.descripcion && params.precio) {

                producto.empresa = empresaId;
                producto.nombre = params.nombre;
                producto.tipo_producto = params.tipo_producto;
                producto.descripcion = params.descripcion;
                producto.precio = params.precio;
                producto.imagen = null;
                producto.estado = '1';


                producto.save((err, productoStored) => {
                    if (err) return res.status(500).send({ message: 'Error al guardar el producto' });

                    if (productoStored) {
                        res.status(200).send({ produtos: productoStored });
                    } else {
                        res.status(404).send({ message: 'No se ha guardado el producto' });
                    }
                });
            } else {
                res.status(404).send({
                    message: ' Envia todos los campos necesarios del producto'
                });
            }
        } else {
            return res.status(404).send({ message: 'No te tiene ninguna empresa con este usuario' });
        }

    });

}

//listar todos los productos de todas las empresas de forma paginada
function getProductosEmpresas(req, res) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 12;

    Producto.find({}, { "__v": 0 }).populate('empresa').paginate(page, itemsPerPage, (err, productos, total) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (!productos) return res.status(404).send({ message: 'No Hay productos del dia' });

        //empresas.password = undefined;
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            productos
        });

    });

}

//listar todos los productos de una empresa
function getProductosEmpresa(req, res) {
    var userId = req.usuario.sub;
    var empresaId = req.params.idEmpresa;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 6;

    Empresa.findOne({ 'usuario': userId, '_id': empresaId }).exec((err, empresa) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        console.log(empresa);

        if (!empresa) return res.status(404).send({ message: 'No tienes permisos para listar los productos de esta empresa' });


        Producto.find({ 'empresa': empresaId }, { "__v": 0 }).paginate(page, itemsPerPage, (err, producto, total) => {
            if (err) return res.status(500).send({ message: 'Error en el servidor' });

            if (!producto) return res.status(404).send({ message: 'No Hay productos del dia' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                producto
            });

        });
    });



}

//Edicion el producto
function updateProducto(req, res) {
    var empresaId = req.params.idEmpresa;
    var productoId = req.params.idProducto;
    var userId = req.usuario.sub;
    var updateProducto = req.body;



    Empresa.findOne({ 'usuario': userId, '_id': empresaId }).exec((err, empresa) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        console.log(empresa);

        if (!empresa) return res.status(404).send({ message: 'No tienes permisos para actulizar los productos de esta empresa' });

        Producto.findByIdAndUpdate({'_id':productoId, 'empresa':empresaId}, updateProducto, { new: true }, (err, productoUpdated) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (!productoUpdated) return res.status(404).send({ message: 'No tienes permisos para actulizar los productos de esta empresa'});

            return res.status(200).send({ producto: productoUpdated });
        });

    });

}

module.exports = {
    saveProducto,
    getProductosEmpresas,
    getProductosEmpresa,
    updateProducto
}