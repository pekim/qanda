
exports.createGame = function() {
  var that = this;
  var clients = {};
  var numberOfClients = 0;
  var inProgess = false;
  var timeToStart = 30;
  var timeToEnd = 0;

  var gameStartCountdownTimerId = setInterval(gameStartCountdown, 1000);
  

  function removeClient(client) {
    delete clients[client.sessionId];
    numberOfClients--;
    
    broadcastClients();
  };
  
  function broadcastClients() {
    broadcast({
      method: 'clients',
      count: numberOfClients,
      clients: Object.keys(clients)
    });
  };
  
  function broadcast(message) {
    for (var sessionId in clients) {
      clients[sessionId].send(message);
    }
  };
  
  function gameStartCountdown() {
    console.log(timeToStart);
    if (timeToStart > 0) {
      broadcast({
        method: 'countdown',
        remaining: timeToStart--
      });
    } else {
      clearInterval(gameStartCountdownTimerId);
      //startGame();
    }
  };
  
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
