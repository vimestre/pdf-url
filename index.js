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
    urls.push({
        uuid: uuid,
        url: req.body.url,
        prov: req.body.prov,
        sociedad: req.body.sociedad,
        variedad: req.body.variedad,
        time: Date.now()
    });

    //3-> Devolvemos el uuid
    res.send(JSON.stringify({ uuid: uuid }));
})


//Get a /Contrato/uuid para obtener una redicción a la url original
app.get('/Contrato/:uuid', (req, res) => {


    // Comprabamos que tenemos ese uuid en memoria
    let uuid = req.params.uuid;

    //console.log("Getting: " + uuid)

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
    if (cache) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                    <title>Contrato de compraventa de citricos</title>
                    <meta property="og:site_name" content="CONTRATO COMPRAVENTA">
                    <meta property="og:title" content="CONTRATO COMPRAVENTA" />
                    <meta property="og:description" content="Contrato de compraventa de ${cache.variedad ?? 'CÍTRICOS'} entre ${cache.sociedad ?? 'COMPRADOR'} y ${cache.prov ?? 'VENDEDOR'}" />
                    <meta property="og:image" itemprop="image" content="https://canamas.com/wp-content/uploads/2019/09/Recurso-38.png">
                    <meta property="og:image:width" content="65" />
                    <meta property="og:image:height" content="65" />
                    <meta property="og:type" content="website" />
                    <meta http-equiv = "refresh" content = "2; url = ${cache.url}" />
            </head>
            <body>
                    <p>Redirigiendo al fichero...</p>
            </body>
            </html>`
        )
    }
    // En caso contrario, informamos al usuario
    else res.send('Enlace no disponible o cadudado')
})

// Arrancar el servidor 
var server = app.listen(88, function () {
    console.log("El servidor funciona en el puerto 80");
});