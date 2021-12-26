'use strict'

// Cargar modulos de node para crear el servidor
var express  = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article');

// MiddLewares
app.use(bodyParser.urlencoded({extended:false}));  //cargar el bodyparser
app.use(bodyParser.json());  //Convertir todo lo que recibamos a json

// CORS  (Buscar cors en nodeJS en victorroblesweb.com y pegarlo)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijo a rutas / Cargar rutas
app.use("/api", article_routes); //Sobreescribir la ruta, deberia añadir esa ruta antes que las otras

// Exportar modulo (fichero actual)
module.exports = app;
