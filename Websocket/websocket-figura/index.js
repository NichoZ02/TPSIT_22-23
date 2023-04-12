const express = require('express');

const server = express()
    .use((req, res) => res.sendFile('/index.html', { root: __dirname })) // Invia index.html al client.
    .listen(3000, () => console.log('Listening on 3000'));

const { Server } = require('ws');

const ws_server = new Server({ server });

// Mostra un messaggio alla connessione e alla disconnessione del client.
ws_server.on('connection', (ws) => {
    console.log('New client connected!');
    ws.on('close', () => console.log('Client has disconnected!'));
});

// Posizione iniziale (left, top).
var position = [100, 100];

var left = 100; // Left.
var top = 100; // Top.

// Muovi l'oggetto da creare un percorso quadrato.
setInterval(() => {
    ws_server.clients.forEach((client) => {
        if(left < 300 && top <= 100 && left >= 100) { // Muovi a destra.
            left = left + 10;
        } else if(left >= 300 && top < 300 && top >= 0) { // Muovi in giù.
            top = top + 10;
        } else if(left > 100 && top >= 300 && left <= 300) { // Muovi a sinistra.
            left = left - 10;
        } else if(left <= 100 && top > 100 && top <= 300) { // Muovi in su.
            top = top - 10;
        }

        // Salva le posizioni.
        position = [left, top];

        // Invia le posizioni al client tramite JSON (per via dell'array).
        client.send(JSON.stringify(position));
        console.log("Position: " + position);
    });
}, 1000);