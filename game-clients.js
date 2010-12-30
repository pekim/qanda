exports.createClients = function(socket) {
  return new function() {
    const INTERGAME_PERIOD = 30;
    
    var inGameClients = [];
    var pendingGameClients = [];
    
    addSocketListeners();
    
    function startIntergamePeriod() {
      var secondsUntilGameStart = INTERGAME_PERIOD;
      var gameStartCountdownTimerId = setInterval(gameStartCountdown, 1000);

      function gameStartCountdown() {
        if (secondsUntilGameStart > 0) {
          broadcastTo(pendingGameClients, {
            method: 'countdown',
            remaining: secondsUntilGameStart--,
            userCount: pendingGameClients.length
          });
        } else {
          clearInterval(gameStartCountdownTimerId);
          startGame();
        }
      }
    }
    
    function broadcastTo(clients, message) {
      clients.forEach(function (client) {
        client.send(message);
      });
    }

    function startGame() {
      broadcastTo(pendingGameClients, {
        method: 'countdown',
        remaining: 'Game On!'
      });
      
      inGameClients = pendingGameClients;
      pendingGameClients = [];
    }

    function addSocketListeners() {
      socket.on('connection', function(client){ 
        console.log('connection');
        
        client.userData = {};
        pendingGameClients.push(client);
  
        client.on('message', function(data){
          console.log('message: ' + data);
          var message = JSON.parse(data);
          
          switch (message.method) {
          case 'hello':
            client.userData.user = message.user;

            break;
          default:
            console.log('Unrecognised method from client: ' + message.method);
          }
        }) 
        
        client.on('disconnect', function(){
          console.log('disconnect');
        }) 
      });
    }
    
    return {
      startIntergamePeriod: startIntergamePeriod
    };
  }();
}
