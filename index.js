'use strict'

var mongoose = require('mongoose');
var app = require('./app');  //Al ser creado manualmente, ponerle la ruta
var port = 3900;  //Puerto que se utilizara para esta aplicacion


// Desactivar los metodos antiguos y usar solo los nuevos
// mongoose.set('useFindAndModify', false);     ----> Esta obsoleto
// Internamente le viene bien pero ns que es
mongoose.Promise = global.Promise;
// Conectar base de datos
// mongoose.connect(url, opciones)
mongoose.connect('mongodb://user1:pass1@localhost:2717/api_rest_blog', {useNewUrlParser: true}).then(()=>{
    console.log("La conexion a la base de datos se ha realizado correctamente!!!");

    // Crear servidor y ponerme a escuchar peticiones http
    app.listen(port, ()=>{
        console.log("Servidor corriendo en http://localhost:"+port);
    });
});

/* mongoose.createConnection(
    'mongodb://localhost:2717/api_rest_blog',
    {
        "auth" : {
            "authSource" : "admin"
        },
        "user" : "user",
        "pass" : "pass"
    }
); */
