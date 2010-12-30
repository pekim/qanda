const createGame = require('game').createGame;

exports.acceptClients = function(socket) {
  var pendingGame;
  var activeGame;
  
  init();
  
  function init() {
    pendingGame = createGame();

    socket.on('connection', function(client){ 
      pendingGame.addClient(client);
    });
  }
};
