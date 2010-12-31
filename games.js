const Game = require('game').Game;

exports.acceptClients = function(socket) {
  var pendingGame;
  var activeGame;
  
  init();
  
  function init() {
    newGame();

    socket.on('connection', function(client){ 
      addClient(client);
    });
  }
  
  function addClient(client) {
    pendingGame.addClient(client);
  }
  
  function newGame() {
    console.log('new game created');
    
    activeGame = pendingGame;
    pendingGame = new Game();

    pendingGame.on('started', function() {
      newGame();
    });
  }
};
