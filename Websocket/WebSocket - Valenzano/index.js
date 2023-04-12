const express = require('express');

const server = express()
    .use((req, res) => res.sendFile('/index.html', { root: __dirname })) // Invia index.html al client.
    .listen(3000, () => console.log('Listening on 3000'));

// Inizializza il server.
const { Server } = require('ws');
const ws_server = new Server({ server });

// Inizializza quadrati.
var quadrati = [
    { id: 1, colore: 'white' },
    { id: 2, colore: 'white' },
    { id: 3, colore: 'white' },
    { id: 4, colore: 'white' },
    { id: 5, colore: 'white' },
    { id: 6, colore: 'white' },
    { id: 7, colore: 'white' },
    { id: 8, colore: 'white' },
    { id: 9, colore: 'white' },
];

// Gestione colore dominante
var coloreDominante = '';
var coloriConteggio = {
    verde: 0,
    rosso: 0,
    blu: 0
};

// Numero di utenti connessi.
var utenti = 0;
// Array di client connessi.
var clients = [];

// Gestione connessione del client.
ws_server.on('connection', (ws) => {
    // Gestione utenti.
    utenti = ws_server.clients.size;
    ws.id = utenti;
    if(utenti > 3) {
        console.log('Client ' + ws.id + ' disconnesso! Utenti connessi: ' + utenti);
        utenti--;
        ws.terminate();
        return;
    } else {
        clients.push(ws.id);
        console.log('Client ' + ws.id + ' connesso! Utenti connessi: ' + utenti);  
    }
    // Assegna un colore al client.
    var colore = '';
    switch(utenti) {
        case 1:
            colore = 'green';
            break;
        case 2:
            colore = 'red';
            break;
        case 3:
            colore = 'blue';
            break;
    }
    ws.send(JSON.stringify({ quadrati: quadrati, colore: colore, coloreDominante: coloreDominante, coloriConteggio: coloriConteggio }));
    // Gestione messaggio del client.
    ws.on('message', function incoming(message) {
        // Ricevi i dati dal client.
        var data = JSON.parse(message);
        console.log(data);
        // Assegna il colore al quadrato.
        quadrati[data.id - 1].colore = data.colore;
        // Conteggia i colori.
        coloriConteggio.verde = 0;
        coloriConteggio.rosso = 0;
        coloriConteggio.blu = 0;
        for(var i = 0; i < quadrati.length; i++) {
            if(quadrati[i].colore == 'green') {
                coloriConteggio.verde++;
            } else if(quadrati[i].colore == 'red') {
                coloriConteggio.rosso++;
            } else if(quadrati[i].colore == 'blue') {
                coloriConteggio.blu++;
            }
        }
        console.log(coloriConteggio);
        // Seleziona il colore dominante.
        if(coloriConteggio.verde >= 5 && coloriConteggio.verde > coloriConteggio.rosso && coloriConteggio.verde > coloriConteggio.blu) {
            coloreDominante = 'Verde';
        } else if(coloriConteggio.rosso >= 5 && coloriConteggio.rosso > coloriConteggio.verde && coloriConteggio.rosso > coloriConteggio.blu) {
            coloreDominante = 'Rosso';
        } else if(coloriConteggio.blu >= 5 && coloriConteggio.blu > coloriConteggio.verde && coloriConteggio.blu > coloriConteggio.rosso) {
            coloreDominante = 'Blu';
        } else {
            coloreDominante = '';
        }
        // Invia i dati ai client (solo a quelli connessi).
        ws_server.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ quadrati: quadrati, colore: colore, coloreDominante: coloreDominante, coloriConteggio: coloriConteggio }));
            }
        });
    });
    // Mostra un messaggio alla disconnessione del client.
    ws.on('close', () => console.log('Client ' + ws.id + ' disconnesso! Utenti connessi: ' + utenti), utenti--);
});
