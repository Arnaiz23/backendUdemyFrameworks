'use strict'

var validator = require('validator');
var fs = require('fs'); //Permitir borrar ficheros de nuestro servidor
var path = require('path');

const { validate, exists } = require('../models/article');
var Article = require('../models/article');

var controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;
        return res.status(200).send({
            "curso": "Master en Framworks JS",
            "autor": "Adrian Arnaiz",
            "url": "adrianarnaizweb.es",
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: "Soy la acción test de mi controlador de articulos"
        });
    },

    // Accion para guardar nuevos articulos
    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title); //Cuando no este vacio el titulo
            var validate_content = !validator.isEmpty(params.content); //Cuando no este vacio el contenido

        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_title && validate_content) {
            // Crear objeto a guardar
            var article = new Article();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;

            // Modificacion para la imagen
            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            }

            // Guardar el articulo
            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        "status": "error",
                        message: "El articulo no se ha guardado!!!"
                    });
                }

                // Devolver respuesta
                return res.status(200).send({
                    "status": "success",
                    "article": articleStored
                });

            });

        } else {
            return res.status(200).send({
                status: "error",
                message: 'Los datos no son validos!!!'
            });
        }

    },

    // Sacar todos los articulos disponibles
    getArticles: (req, res) => {

        var query = Article.find();

        // Si el parametro last existe, sacara solo los ultimos 5 articulos
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);  //Me saca solo los que le ponga como límite
            // De esta manera, le estamos poniendo un limite a la consulta que hagamos
        }

        // Find
        // Article.find().sort('_id').exec((err, articles) =>{  Ascendente
        query.sort('-_id').exec((err, articles) => {  //Descendente

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los articulos !!!"
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay articulos para mostrar"
                });
            }

            return res.status(200).send({
                status: "success",
                articles
            });
        });
    },

    // Sacar solo un articulo
    getArticle: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el articulo !!!"
            });
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el articulo !!!"
                });
            }

            // Devolver json
            return res.status(200).send({
                status: "success",
                article
            });
        });
    },

    //Actualizar articulo
    update: (req, res) => {
        // Recoger el id del articulo
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title); //Cuando no este vacio el titulo
            var validate_content = !validator.isEmpty(params.content); //Cuando no este vacio el contenido
        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        if (validate_title && validate_content) {
            // Find and update
            // new : true -> devuelve el objeto ya actualizado
            Article.findByIdAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al actualizar"
                    });
                }

                if (!articleUpdate) {
                    return res.status(404).send({
                        status: "error",
                        message: "No existe el articulo"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    articleUpdate
                });
            });
        } else {
            return res.status(200).send({
                status: "error",
                message: "La validacion no es correcta"
            });
        }
    },

    // Eliminar articulos
    delete: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemove) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al eliminar"
                });
            }
            if (!articleRemove) {
                return res.status(404).send({
                    status: "error",
                    message: "No se ha borrado el articulo, posiblemente no exista!!!"
                });
            }

            return res.status(200).send({
                status: "succes",
                articleRemove
            });
        });
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la peticion
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: "error",
                message: file_name
            });
        }

        // Conseguir el nombre y la extension
        var file_path = req.files.file0.path; //file0 es un nombre generico que le pondremos pq algunas librerias del frontend envian ese nombre
        var file_split = file_path.split("/");

        /* *ADVERTENCIA* EN WINDOWS O MAC
        WINDOWS -> var file_split = file_path.split("\\");
        MAC -> var file_split = file_path.split("/"); */

        // Nombre del archivo
        var file_name = file_split[2];

        // Extension del fichero
        var extension_split = file_name.split(".");
        var file_ext = extension_split[1];


        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: "error",
                    message: "La extension de la imagen no es valida"
                });
            });  //Borrar el fichero
        } else {
            // Sacando el id de la url
            var articleId = req.params.id;

            if (articleId) {
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdate) => {
                    if (err || !articleUpdate) {
                        return res.status(200).send({
                            status: "error",
                            message: "Error al guardar la imagen del articulo!!!"
                        });
                    }

                    return res.status(200).send({
                        status: "success",
                        articleUpdate
                    });
                });
            }else{  //En caso de que no sepa el id
                return res.status(200).send({
                    status: "success",
                    image: file_name
                });
            }

        }
    }, //end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: "error",
                    message: "La imagen no existe"
                });
            }
        });
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },  //Si el searchString esta incluido("i") dentro del titulo("title")
                { "content": { "$regex": searchString, "$options": "i" } } //Si el searchString esta incluido("i") dentro del contenido("content")
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error en la peticion!!!"
                    });
                }
                if (!articles || articles.length <= 0) {
                    return res.status(500).send({
                        status: "error",
                        message: "No hay articulos que coincidan con tu busqueda"
                    });
                }
                return res.status(200).send({
                    status: "success",
                    articles
                });
            });
    }
};  //end controller


module.exports = controller;