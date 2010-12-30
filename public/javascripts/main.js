require(['urlparser', 'socket.io/socket.io.js'], function(urlParser) {
  $(function() {
    var user = urlParser.getQueryParameter('user');
    console.log('user: ' + user);
    
    var socket = new io.Socket(); 
    socket.on('connect', function(){
      console.log('connect');
      socket.send(JSON.stringify({
        method: 'hello', 
        user: user}));
    });
    
    socket.on('message', function(message) {
      if (message.method === 'clients') {
        
        var clients = '';
        for (var c = 0; c < message.clients.length; c++) {
          clients += message.clients[c] + '\r\n';
        }
        
        $('.user-count').text(message.clients.length);
        $('.users').text(clients);
      }

      if (message.method === 'countdown') {
        $('.countdown').text(message.remaining);
      }
    }); 

    socket.on('disconnect', function(){ 
      console.log('disconnect');
    });
    
    socket.connect();
  });
});
