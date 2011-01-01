exports.apply = function(app) {
  app.get('/', function(req, res){
    res.render('index', {
      locals: {
        title: 'QandA'
      }
    });
  });

  app.get('/protected', function(req, res){
    req.authenticate(['user'], function(error, authenticated) {
      res.render('protected', {
        locals: {
          authDetails: req.getAuthDetails(),
          title: 'Protected page'
        }
      });
    });
  });

  app.get('/logout', function(req, res){
    req.logout();

    res.writeHead(303, { 'Location': "/" });
    res.end('');
  });
}
