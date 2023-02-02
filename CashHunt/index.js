var express = require("express");
var path = require("path");
var app = express();
var ejs = require("ejs");
var utils = require("./utils");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

var budget = 10000;
var message = '';

//La pagina home
app.get("/", function(req, res) 
{
  res.render("home", 
  {
    topicHead: "Cash Hunt",
    message: message,
  });
});

//La pagina del gioco
app.post("/game", function(req, res) 
{
  var limite_ricarica = 1000;

  if (req.body.add != undefined) 
  {
    var aggiungi_budget = parseFloat(req.body.add);
    if (aggiungi_budget > limite_ricarica || aggiungi_budget < 0) 
    {
      message = 'Non puoi caricare più di ' + limite_ricarica + ' euro e meno di 0 euro';

    } 
    else 
    {
      budget += aggiungi_budget;

    }
  } 
  else if (budget == 0) 
  {  
    // Se l'utente ha esaurito il conto
    message = 'Hai esaurito il budget!';
  } 
  else 
  {
    message = 'GIOCA E VINCI!!!';

  }
  
  res.render("game", 
  {
    topicHead: "Cash Hunt",
    images: utils.immagini(),
    saldo: budget,
    message: message,
    lim: limite_ricarica
  });
});

//La pagina dei risultati
app.post("/risultati", function(req, res) 
{
  user_puntata = parseFloat(req.body.puntata);  // La puntata dell'utente

  // Se la puntata è valida
  // Array moltiplicatori e la casella scelta dall'utente
  var array_moltip = utils.vincite();
  var casella_scelta = req.body.casella;
  //Separa la stringa in due coordinate di tipo intero
  var casella_uscita = casella_scelta.split(',');
  parseInt(casella_uscita[0]);
  parseInt(casella_uscita[1]);
  
  // Sottrae dal budget dell'utente la somma giocata
  budget -= user_puntata;

  // Calcola la vincita/perdita
  var vincita_parz = user_puntata * array_moltip[casella_uscita[0]][casella_uscita[1]];

  if (vincita_parz != 0) 
  {  
    // Se vince restituisce all'utente la         puntata
    var vincita = vincita_parz + user_puntata;
  }
  else 
  { 
    //Se perde la vincita è 0
    var vincita = vincita_parz
  }

  // Aggiorna il budget dell'utente
  budget += vincita;

  if (budget == 0) 
  {  
    // Se l'utente ha esaurito il conto
    message = 'Hai esaurito il budget!';
  } 
  else 
  {
    message = 'GIOCA E VINCI!!!';

  }
  // Invia la pagina dei risultati
  res.render("risultati", 
  {
    topicHead: "Cash Hunt",
    numeri: array_moltip,
    saldo: budget,
    puntata: user_puntata,
    vincita: vincita_parz,
    x: casella_uscita[0],
    y: casella_uscita[1],
    moltip: array_moltip[casella_uscita[0]][casella_uscita[1]]
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function() 
{
  console.log("Listening on " + port);
  
});
