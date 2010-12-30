

exports.createGame = function() {
  const clients = [];
  
  return {
    addClient: function(client) {
      console.log('client added - ' + client.request.client.remoteAddress + ':' + client.request.client.remotePort);
      clients.push(client);
    }
  };
};
