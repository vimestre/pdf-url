# Pequeño servidor en Node+Espress para acortar url

Servidor usado para acortar los enlaces generados en sharepoint a ficheros pdf, pero se podría usar para acortar cualquier tipo de enlace.
Corre sobre Node y utiliza los paquetes: express, cors, body-parser y crypto

## POST /Short

El servidor recibe una url en el body {url: 'https://...'}.
Genera un uuid, guarda en memoria el uuid, la fecha de generación y la url original; y devuelve el uuid generado.

## GET '/Contrato/:uuid'

Comprueba que el uuid esté en memoria y tenga menos de 4 días, de ser así, devuelve una redirección a la url original.
