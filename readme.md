# Pequeño servidor en Node+Espress para acortar url

## POST /Short

El servidor recibe una url en el body {url: 'https://...'}, genera un uuid y guarda en memoria el uuid, la fecha de generación y la url original

## GET '/Contrato/:uuid'

Comprueba que el uuid esté en memoria y tenga menos de 4 días, de ser así, devuelve una redirección a la url original
