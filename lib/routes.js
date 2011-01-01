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

  app.post('/register', function(req, res) {
    var user = new User();
    user.user = req.body.user;
    user.name = req.body.name;
    user.salt = Math.floor(Math.random() * 0x100000000).toString(16);
    user.password = req.body.password;
    user.save(function() {
      res.writeHead(303, { 'Location': "/registered/" + user.user });
      res.end('');
    });
  });

  app.get('/registered/:user', function(req, res) {
    res.render('registered', {
      locals: {
        title: 'Registered',
        user: req.params.user
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
      res.send(user ? 'Already in use' : '', { 'Content-Type': 'text/plain' });
    });
  });
}

function ensureUser(req, res, next) {
  req.authenticate(['user'], function(error, authenticated) {
    next();
  });
}