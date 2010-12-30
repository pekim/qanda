// Make local paths accessible.
require.paths.unshift(__dirname);

/**
 * Module dependencies.
 */
var express = require('express'),
    io = require('socket.io'),
    games = require('./games'),
    gameClients = require('./game-clients');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'QandA'
    }
  });
});

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}

var socket = io.listen(app);
games.acceptClients(socket);

//var gameClients = gameClients.createClients(socket);
//gameClients.startIntergamePeriod();


// Exit if any js file or template file is changed.
// It is ok because this script encapsulated in a batch while(true);
// So it runs again after it exits.
var autoexit_watch = require('autoexit').watch;

var on_autoexit = function (filename) { } // if it returns false it means to ignore exit this time;  
autoexit_watch(__dirname, ".js", on_autoexit);
