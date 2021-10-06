'use strict';

var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');


//metodos de prueba
function home(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde el servidor de Node'
    });
};


//registro User
function crearUsuario(req, res) {
    var params = req.body;
    var usuario = new Usuario();

    if (params.nombre && params.apellido && params.nickname && params.email && params.password && params.telefono && params.direccion) {

        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;
        usuario.nickname = params.nickname;
        usuario.email = params.email;
        usuario.telefono = params.telefono;
        usuario.direccion = params.direccion;
        usuario.role = 'ROLE_USER';
        usuario.imagen = null;
        usuario.estado = '1';

        // Controlar Usuarios Duplicados
        Usuario.find({
            $or: [
                { email: usuario.email.toLowerCase() },
                { nickname: usuario.nickname.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error enla peticion de usuarios' });

            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'El usuario que intenta registrar ya existe' });
            } else {

                //Cifra la Password y me guarda los datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    usuario.password = hash;

                    usuario.save((err, userStored) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });

                        if (userStored) {
                            userStored.password = undefined;
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        }

                    });
                });

            }
        });


    } else {
        res.status(200).send({
            message: 'Envia todos los campos necesarios'
        });
    }

}


//Login 
function loginUsuario(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    Usuario.findOne(
        { email: email }, (err, user) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {

                        if (params.gettoken) {
                            //Generar y Devolver token
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                            
                        } else {
                            //Devolver datos de usuario
                            user.password = undefined;
                            return res.status(200).send({ user });
                        }

                    } else {
                        return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                    }

                });
            } else {
                return res.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
            }
        }
    );
}

//conseguir datos de un usuario
function getUsuario(req, res) {
    var userId = req.params.id;

    Usuario.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!user) return res.status(404).send({ message: 'el usuario no existe' });

        user.password = undefined;
        return res.status(200).send({ user });
    });
}


//devolver un listado de usuarios paginados

function getUsuarios(req, res) {
    var identity_user_id = req.usuario.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 3;

    Usuario.find({},{"password":0,"__v":0}).sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!users) return res.status(404).send({ message: 'no hay usuarios disponibles' });

        return res.status(200).send({
            usuarios: users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });

}



// Edicion de datos de usuario
function updateUsuario(req, res) {
    var userId = req.body.id;
    var update = req.body;


    //Borrar la propiedad password
    delete update.password;

    if (userId != req.usuario.sub) {
        return res.status(500).send({ message: ' No tienes permisos para actualizar los datos del usuario' });
    }

    Usuario.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!userUpdated) return res.status(404).send({ message: 'No se a podido actualizar el ususario' });

        return res.status(200).send({ user: userUpdated });
    });

}



//subir archivos de imagen/avatar de usuario
function uploadImagen(req, res) {
    var userId = req.params.id;



    if (req.files) {
        var file_path = req.files.imagen.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.')
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);


        if (userId != req.usuario.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permisos para actualizar los datos del usuario');
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            //actualizar documento de usuario logeado
            Usuario.findByIdAndUpdate(userId, { imagen: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!userUpdated) return res.status(404).send({ message: 'No se a podido actualizar el ususario' });

                return res.status(200).send({ user: userUpdated });

            });

        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }

    } else {

        return res.status(200).send({ message: 'No se han subido imagenes' });
    }
}

//funcion para eliminar una imagen que guarda fs pero no es validada
function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}


//lista la imagen del usuario
function getImagenFile(req, res) {
    var image_file = req.params.imagenFile;
    var path_file = './uploads/usuarios/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: ' no existe la imagen' });
        }
    });
}

module.exports = {
    home,
    crearUsuario,
    loginUsuario,
    getUsuario,
    getUsuarios,
    updateUsuario,
    uploadImagen,
    getImagenFile
};