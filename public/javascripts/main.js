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
    
    socket.on('message', function(message){ 
      $('.countdown').text(message.remaining);
      $('.user-count').text(message.userCount);
    }); 

    socket.on('disconnect', function(){ 
      console.log('disconnect');
    });
    
    socket.connect();
  });
});
