const User = require('mongo/user');

exports.apply = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      locals: {
        title: 'QandA'
      }
    });
  });

  app.get('/protected', ensureUser, function(req, res) {
    res.render('protected', {
      locals: {
        authDetails: req.getAuthDetails(),
        title: 'Protected page'
      }
    });
  });

  app.get('/register', function(req, res) {
    res.render('register', {
      locals: {
        title: 'Register',
        actionUrl: '/register'
      }
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();

    res.writeHead(303, { 'Location': "/" });
    res.end('');
  });

  app.get('/checkIfUserUsed/:user', function(req, res){
    User.findByUser(req.params.user).exec().first(function(user) {
      res.send(user ? 'Already in use' : '');
    });
  });
}

function ensureUser(req, res, next) {
  req.authenticate(['user'], function(error, authenticated) {
    next();
  });
}