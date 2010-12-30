

exports.createGame = function() {
  return {
    clients: {},
    numberOfClients: 0,
    
    addClient: function(client) {
      var that = this;
      
      this.clients[client.sessionId] = client;
      this.numberOfClients++;

      client.on('disconnect', function(){
        that.removeClient.call(that, client);
      });
      
      this.broadcastClients();
    },

    removeClient: function(client) {
      delete this.clients[client.sessionId];
      this.numberOfClients--;
      
      this.broadcastClients();
    },
    
    broadcastClients: function() {
      this.broadcast({
        method: 'clients',
        count: this.numberOfClients
      });
    },
    
    broadcast: function(message) {
      for (var sessionId in this.clients) {
        this.clients[sessionId].send(message);
      }
    }
  };
};
