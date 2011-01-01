const connect= require('connect'),
      url= require('url');

module.exports= function(options) {
  options = options || {};
  var strategy = {};

  strategy.name     = options.name || "user";
  
  function failed_validation( request, response, uri ) {
    var parsedUrl= url.parse(request.url, true);
    var redirectUrl= "/auth/form_callback";
    
    if (uri) {
      redirectUrl= redirectUrl + "?redirect_url=" + uri;
    } else if (parsedUrl.query && parsedUrl.query.redirect_url) {
      redirectUrl= redirectUrl + "?redirect_url=" + parsedUrl.query.redirect_url;
    }
    
    response.writeHead(303, { 'Location':  redirectUrl });
    response.end('');
  }
  
  function validate_credentials(executionScope, request, response, callback) {
//    setTimeout(function() {
      var parsedUrl= url.parse(request.url, true);
      if (request.body && request.body.user && request.body.password) {
        if (request.body.user == 'foo' && request.body.password == 'bar' ) {
          executionScope.success({name:request.body.user}, callback);
        } 
        else {
          executionScope.fail(callback);
        }
      }
      else {
        failed_validation(request, response);
      }
//    }, 100);
  }
  
  strategy.authenticate = function(request, response, callback) {
    console.log(require('util').inspect(this, 5));
    if (request.body && request.body.user && request.body.password) { 
      validate_credentials(this, request, response, callback);
    } else {
      failed_validation(request, response, request.url);
    }
  };

  strategy.setupRoutes = function(server) {
    server.use('/', connect.router(function routes(app) {
      app.post('/auth/form_callback', function(request, response){
        request.authenticate([strategy.name], function(error, authenticated) {
          var redirectUrl = "/";
          var parsedUrl = url.parse(request.url, true);
          
          if (parsedUrl.query && parsedUrl.query.redirect_url) {
            redirectUrl = parsedUrl.query.redirect_url;
          }
          
          response.writeHead(303, { 'Location':  redirectUrl });
          response.end('');
        })
      });
      
      app.get('/auth/form_callback', function(request, response) {
        var parsedUrl = url.parse(request.url, true);
        var redirectUrl= "";
        if (parsedUrl.query && parsedUrl.query.redirect_url) {
          redirectUrl = "?redirect_url=" + parsedUrl.query.redirect_url;
        }
        
        response.render('authenticate', {
          locals: {
//            authenticated: request.isAuthenticated(),
//            authDetails: request.getAuthDetails(),
//            authenticated: '?',
//            authDetails: {user: {}},
            title: 'qQandA',
            redirectUrl: redirectUrl
          }
        });
      });
    }));
  };
  
  return strategy;
};
