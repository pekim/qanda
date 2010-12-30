

//exports.createGame = function() {
//  
//  
//  return {
//    clients: {},
//    numberOfClients: 0,
//    inProgess: false,
//    timeToStart: 30,
//    timeToEnd: 0,
//    
//    addClient: function(client) {
//      this.gameStartCountdownTimerId = setInterval(this.gameStartCountdown, 1000);
//      var that = this;
//      
//      this.clients[client.sessionId] = client;
//      this.numberOfClients++;
//
//      client.on('disconnect', function(){
//        that.removeClient.call(that, client);
//      });
//      
//      this.broadcastClients();
//    },
//
//    removeClient: function(client) {
//      delete this.clients[client.sessionId];
//      this.numberOfClients--;
//      
//      this.broadcastClients();
//    },
//    
//    broadcastClients: function() {
//      this.broadcast({
//        method: 'clients',
//        count: this.numberOfClients,
//        clients: Object.keys(this.clients)
//      });
//    },
//    
//    broadcast: function(message) {
//      for (var sessionId in this.clients) {
//        this.clients[sessionId].send(message);
//      }
//    },
//    
//    gameStartCountdown: function() {
//      console.log(this.timeToStart);
//      if (this.timeToStart > 0) {
//        this.broadcast({
//          method: 'countdown',
//          remaining: this.timeToStart--
//        });
//      } else {
//        clearInterval(this.gameStartCountdownTimerId);
//        //startGame();
//      }
//    },
//
//    gameStartCountdownTimerId: setInterval(this.gameStartCountdown, 1000)
//  };
//};

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
