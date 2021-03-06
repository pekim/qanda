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
      res.redirect('/registered/' + user.user, 303);
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

  app.get('/users', ensureUser, function(req, res) {
    User.allUsers(function(users) {
      res.render('users', {
        locals: {
          title: 'Users',
          users: users
        }
      });
    });
  });

  app.get('/deleteuser/:user', ensureUser, function(req, res) {
    User.remove({user: req.params.user}, function() {
      res.redirect('/users', 303);
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/', 303);
  });

  app.get('/checkIfUserUsed/:user', function(req, res){
    User.findByUser(req.params.user, function(user) {
      res.send(user ? 'Already in use' : '', { 'Content-Type': 'text/plain' });
    });
  });
}

function ensureUser(req, res, next) {
  req.authenticate(['user'], function(error, authenticated) {
    next();
  });
}
