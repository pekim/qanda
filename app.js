// Make local paths accessible.
require.paths.unshift(__dirname);

/**
 * Module dependencies.
 */
const express = require('express'),
      auth = require('connect-auth'),
      authFormStrategy = require('./auth-form-strategy');

const app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.cookieDecoder());
  app.use(express.session());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(auth(authFormStrategy()));
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

app.get('/protected', function(req, res){
  req.authenticate(['user'], function(error, authenticated) {
//    console.log(require('util').inspect(req, 5));
    console.log(req.isAuthenticated());
    console.log(req.getAuthDetails());
    res.render('protected', {
      locals: {
        authenticated: req.isAuthenticated(),
        authDetails: req.getAuthDetails(),
        title: 'QandA'
      }
    });
  });
});

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}

// Exit if any js file or template file is changed.
// It is ok because this script encapsulated in a batch while(true);
// So it runs again after it exits.
var autoexit_watch = require('autoexit').watch;

var on_autoexit = function (filename) { } // if it returns false it means to ignore exit this time;  
autoexit_watch(__dirname, ".js", on_autoexit);
