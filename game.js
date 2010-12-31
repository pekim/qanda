
exports.createGame = function() {
  var that = this;
  var clients = {};
  var numberOfClients = 0;
  var inProgess = false;
  var timeToStart = 10;
  var timeToEnd = 10;

  var gameStartCountdownTimerId = setInterval(gameStartCountdown, 1000);
  var gameEndCountdownTimerId;

  function removeClient(client) {
    delete clients[client.sessionId];
    numberOfClients--;
    
    broadcastClients();
  }
  
  function broadcastClients() {
    broadcast({
      method: 'clients',
      count: numberOfClients,
      clients: Object.keys(clients)
    });
  }
  
  function broadcast(message) {
    for (var sessionId in clients) {
      clients[sessionId].send(message);
    }
  }
  
  function gameStartCountdown() {
    if (timeToStart > 0) {
      broadcast({
        method: 'status',
        status: 'pendingGame',
        remaining: timeToStart--
      });
    } else {
      clearInterval(gameStartCountdownTimerId);
      startGame();
    }
  }

  function gameEndCountdown() {
    if (timeToEnd > 0) {
      broadcast({
        method: 'status',
        status: 'inGame',
        remaining: timeToEnd--
      });
    } else {
      broadcast({
        method: 'status',
        status: 'gameOver',
        remaining: 0
      });

      clearInterval(gameEndCountdownTimerId);
    }
  }
  
  function startGame() {
    gameEndCountdownTimerId = setInterval(gameEndCountdown, 1000);
  }
  
  function addClientX(client) {
    clients[client.sessionId] = client;
    numberOfClients++;

    client.on('disconnect', function(){
      removeClient.call(that, client);
    });
    
    broadcastClients();
  }

  return {
    addClient: function(client) {
      addClientX(client);
    }
  };
};
