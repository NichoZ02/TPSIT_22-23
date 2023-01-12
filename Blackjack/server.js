const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const fs = require('fs');

const app = express();

// Imposta EJS per i template
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// Route della pagina principale
app.get('/', (req, res) => {
  res.render('home');
});

// Route della pagina per le scommesse iniziali
app.get('/bet', (req, res) => {
  res.render('bet');
});

// Route della pagina delle scommesse in gioco
app.get('/bet-in-game', (req, res) => {
  // Ottieni ID partita
  const gameId = req.query.gameId;
  // Leggi salvataggio
  const gameState = readGameState(gameId);
  // Renderizza pagina
  res.render('bet-in-game', { gameState, gameId });
});

app.post('/bet-in-game', (req, res) => {
  const gameId = req.query.gameId;
  const gameState = readGameState(gameId);
  // Imposta scommessa e rimuovi soldi dal giocatore
  gameState.bet = req.body.bet;
  gameState.playerMoney = gameState.playerMoney - parseInt(gameState.bet);
  saveGameState(gameId, gameState);
  res.redirect(`/game-in-progress?gameId=${gameId}`);
});

// Route della pagina delle regole
app.get('/rules', (req, res) => {
  res.render('rules');
});

// Route della pagina dei crediti
app.get('/credits', (req, res) => {
  res.render('credits');
});

// Route per la creazione di una nuova partita
app.post('/new-game', (req, res) => {
  // Genera un ID per ogni partita
  const gameId = uuid.v4();
  // Crea un oggetto-stato per la partita
  const gameState = {
    gameId: gameId,
    playerCards: [],
    dealerCards: [],
    currentTurn: 'player',
    winner: null,
    playerMoney: 100,
    bet: null
  };

  // Imposta scommessa
  if(req.body.bet != undefined) {
    gameState.bet = req.body.bet;
  }

  // Gestione redirect per la scommessa.
  if(gameState.bet === null) {
    res.redirect('/bet');
    return;
  }

  gameState.playerMoney -= gameState.bet;

  saveGameState(gameId, gameState);

  // Inizia partita
  res.redirect(`/game-in-progress?gameId=${gameId}`);
});

// Route della partita
app.get('/game-in-progress', (req, res) => {
  const gameId = req.query.gameId;
  const gameState = readGameState(gameId);
  res.render('game-in-progress', { gameState, getScore, gameId, isBusted });
});

// Route post-turno
app.post('/game-in-progress', (req, res) => {
  const gameId = req.query.gameId;
  const gameState = readGameState(gameId);

  // Gestione conclusione mano
  if(req.body.resetWinner == 1) {
    res.redirect(`/bet-in-game?gameId=${gameId}`);
    gameState.winner = null;
    gameState.playerCards = [];
    gameState.dealerCards = [];
    gameState.currentTurn = 'player';
  }

  saveGameState(gameId, gameState);
  res.render('game-in-progress', { gameState, getScore, gameId, isBusted });
});

// Route per le azioni del giocatore
app.post('/player-action', (req, res) => {
  const gameId = req.body.gameId;
  // Ottieni azione
  const action = req.body.action;

  let gameState = readGameState(gameId);

  // Gestione hit
  if (action === 'hit') {
    // Dai carta al giocatore
    gameState.playerCards.push(getRandomCard());
    // Controlla se il giocatore ha sballato
    if (isBusted(gameState.playerCards)) {
      gameState.winner = 'dealer';
    }
  }

  // Gestione blackjack
  if (gameState.playerCards.length === 2 && getScore(gameState.playerCards) === 21) {
		gameState.dealerCards.push(getRandomCard());
		gameState.dealerCards.push(getRandomCard());
		if(gameState.dealerCards.length === 2 && getScore(gameState.dealerCards) === 21) {
			gameState.winner = 'tie';
			gameState.playerMoney = gameState.playerMoney + parseInt(gameState.bet);
		}
    gameState.winner = 'player';
    gameState.playerMoney = gameState.playerMoney + parseInt(gameState.bet * 2.5);
  }

  // Gestione double
  if (action === 'double') {
    gameState.playerCards.push(getRandomCard()); // Dai carta al giocatore
		gameState.playerMoney = gameState.playerMoney - parseInt(gameState.bet);
    gameState.bet = gameState.bet * 2;
    // Controlla se il giocatore ha sballato
    if (isBusted(gameState.playerCards)) {
      gameState.winner = 'dealer';
    }
  }

  // Gestione split
  /*
  if (action === 'split') {
    gameState.playerCards.push(getRandomCard()); // Dai carta al giocatore
    gameState.playerCards.push(getRandomCard()); // Dai carta al giocatore
    gameState.bet = gameState.bet * 2;
    gameState.playerMoney = gameState.playerMoney - parseInt(gameState.bet);
    // Controlla se il giocatore ha sballato
    if (isBusted(gameState.playerCards)) {
      gameState.winner = 'dealer';
    }
  } */

  // Se ti fermi o hai sballato, è il turno del dealer
  if (action === 'stand' || isBusted(gameState.playerCards)) {
    // Turno del dealer
    gameState.currentTurn = 'dealer';

    // Dai carte al dealer fino a quando il punteggio è 17 o superiore
    while (getScore(gameState.dealerCards) < 17) {
      gameState.dealerCards.push(getRandomCard());
    }

    // Controlla se il dealer ha sballato
    if (isBusted(gameState.dealerCards)) {
      gameState.winner = 'player';
      gameState.playerMoney = gameState.playerMoney + parseInt(gameState.bet * 2);
    } else {
      // Scegli vincitore
      gameState.winner = determineWinner(gameState.playerCards, gameState.dealerCards);
      if(gameState.winner === 'player') {
        gameState.playerMoney = gameState.playerMoney + parseInt(gameState.bet * 2);
      }
      else if(gameState.winner === 'tie') {
        gameState.playerMoney = gameState.playerMoney + parseInt(gameState.bet);
      }
    }
  }
  saveGameState(gameId, gameState);
  res.redirect(`/game-in-progress?gameId=${gameId}`);
});

// Funzione per salvare lo stato della partita
function saveGameState(gameId, gameState) {
  fs.writeFileSync(`./game-states/${gameId}.json`, JSON.stringify(gameState));
}

// Funzione per leggere lo stato della partita
function readGameState(gameId) {
  return JSON.parse(fs.readFileSync(`./game-states/${gameId}.json`));
}

// Genera una carta casuale
function getRandomCard() {
  const suits = ['cuori', 'quadri', 'fiori', 'picche'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  const randomValue = values[Math.floor(Math.random() * values.length)];

  return { suit: randomSuit, value: randomValue };
}

// Scegli il vincitore
function determineWinner(playerCards, dealerCards) {
  const playerScore = getScore(playerCards);
  const dealerScore = getScore(dealerCards);
  if (playerScore > 21) {
    return 'dealer';
  } else if (dealerScore > 21) {
    return 'player';
  } else if (playerScore > dealerScore) {
    return 'player';
  } else if (dealerScore > playerScore) {
    return 'dealer';
  } else {
    return 'tie';
  }
}

// Controlla se la mano ha sballato
function isBusted(hand) {
  return getScore(hand) > 21;
}

// Calcola punteggio
function getScore(hand) {
  let score = 0;
  let hasAce = false;

  for (const card of hand) {
    if (card.value === 'A') {
      hasAce = true;
      score += 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value, 10);
    }
  }

  // Se si ottiene un asso e il punteggio è superiore a 21, fallo valere 1 invece di 11.
  if (hasAce && score > 21) {
    score -= 10;
  }

  return score;
}

// Avvia server
app.listen(3000, () => {
  console.log('Blackjack app listening on port 3000!');
});
