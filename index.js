//Declaración de variables
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const crypto = require('crypto');
const app = express();

function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    return (Math.abs(a - b) / _MS_PER_DAY);
}

//Configuración del servidor
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

//Caché en memoria de url
let urls = [];

//Post a /Short para generar url acortada
app.post('/Short', (req, res) => {

    //1-> Generamos un uuid
    let uuid = crypto.randomUUID();

    //2-> Guardamos el uuid, la fecha de generación y la url original en la caché
    urls.push({ uuid: uuid, url: req.body.url, time: Date.now() });

    //3-> Devolvemos el uuid
    res.send(JSON.stringify({ uuid: uuid }));
})


//Get a /Contrato/uuid para obtener una redicción a la url original
app.get('/Contrato/:uuid', (req, res) => {

    // Comprabamos que tenemos ese uuid en memoria
    let uuid = req.params.uuid;
    let cache = urls.find(u => u.uuid === uuid)

    // Si existe, hay que revisar que no haya caducado
    if (cache) {
        const diffTime = dateDiffInDays(cache.time, Date.now())
        if (diffTime > 4) {

            // Si está caducado lo eliminamos de la memoria
            const index = urls.indexOf(cache);
            urls.splice(index, 1);

            // Indicamos que no está en caché
            cache = null;
        }

    }

    // Si lo tenemos en memoria, devolvemos una redirección a la url original
    if (cache) res.redirect(cache.url);

    // En caso contrario, informamos al usuario
    else res.send('Enlace no disponible o cadudado')
})

// Arrancar el servidor 
var server = app.listen(88, function () {
    console.log("El servidor funciona en el puerto 80");
});