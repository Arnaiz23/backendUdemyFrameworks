'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/articles'}); //En este caso estamos configurando donde va a guardar los archivos


// Rutas de prueba
router.get('/test-de-controlador',ArticleController.test);
router.post('/datos-curso',ArticleController.datosCurso);

// Rutas útiles
router.post('/save', ArticleController.save);
// router.get('/articles',ArticleController.getArticles);
router.get('/articles/:last?',ArticleController.getArticles); //El parametro 'last' seria opcional. En caso de enviarlo seria solo los 5 ultimos
router.get('/article/:id',ArticleController.getArticle);
router.put('/article/:id',ArticleController.update);
router.delete('/article/:id',ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;