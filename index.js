const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

let urls = [];

app.post('/Short', (req, res) => {
    //console.log(req.body);
    let uuid = crypto.randomUUID();
    urls.push({ uuid: uuid, url: req.body.url, time: Date.now() });
    res.send(JSON.stringify({ uuid: uuid }));
})

function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    return (Math.abs(a - b) / _MS_PER_DAY);
}

app.get('/Contrato/:uuid', (req, res) => {
    let uuid = req.params.uuid;
    let cache = urls.find(u => u.uuid === uuid)
    if (cache) {
        //Está cadudado??
        const diffTime = dateDiffInDays(cache.time, Date.now())
        if (diffTime > 2) {
            const index = urls.indexOf(cache);
            urls.splice(index, 1);
            cache = null;
        }

    }
    if (cache) res.redirect(cache.url);
    else res.send('Enlace no disponible o cadudado')
})

var server = app.listen(88, function () {
    //app.use(cors())
    console.log("El servidor funciona en el puerto 80");
});
