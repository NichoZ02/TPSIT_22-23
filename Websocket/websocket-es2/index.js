const express = require("express");
const fs = require("fs");

const server = express()
    .use((req, res) => res.sendFile("/index.html", { root: __dirname })) // Invia index.html al client.
    .listen(3000, () => console.log("Listening on 3000"));

// Crea server.
const { Server } = require("ws");
const ws_server = new Server({ server });

// Inizializza i quadrati.
const squares = [
    { id: 1, color: "white" },
    { id: 2, color: "white" },
    { id: 3, color: "white" },
    { id: 4, color: "white" },
    { id: 5, color: "white" },
];

// Gestisci connessione.
ws_server.on("connection", (ws) => {
    console.log("Client ID: " + ws_server.clients.size);
    // Se ci sono più di 4 client, rifiuta la connessione.
    if (ws_server.clients.size > 4) {
        ws.send("Too many clients!");
        ws.close();
        return;
    } else {
        console.log("New client connected!");
        // Invia i quadrati al client.
        ws.send(JSON.stringify(squares));
        // Gestisci messaggi.
        ws.on("message", function incoming(message) {
            const data = JSON.parse(message);
            // Trova quadrato cliccato.
            const square = squares.find((sq) => sq.id === data.id);
            // Se il quadrato esiste, esegui queste condizioni.
            if (square) {
                // Aggiorna colore.
                square.color = data.color;
                // Salva stato dei quadrati.
                fs.writeFile("squares.json", JSON.stringify(squares), (err) => {
                    if (err) throw err;
                    console.log("Squares status saved!");
                });
                // Mostra i nuovi quadrati.
                ws_server.clients.forEach((client) => {
                    client.send(JSON.stringify(squares));
                });
            }
        });
    }
    ws.on("close", () => console.log("Client has disconnected!"));
});
