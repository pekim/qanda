const connect= require('connect'),
      url= require('url'),
      User = require('mongo/user');

const CALLBACK_PATH = '/auth/form_callback',
      REDIRECT_PARAMETER = 'redirect_url';

module.exports= function(options) {
  options = options || {};
  var strategy = {};

  strategy.name = options.name || 'user';
  
  strategy.authenticate = function(request, response, callback) {
    if (request.body && request.body.user && request.body.password) {
      var credentials = {
          user: request.body.user,
          password: request.body.password
      };
      
      validate_credentials(this, credentials, request, response, callback);
    } else {
      failed_validation(request, response, request.url);
    }
  };

  strategy.setupRoutes = function(server) {
    server.use('/', connect.router(function routes(app) {
      app.post(CALLBACK_PATH, function(request, response){
        request.authenticate([strategy.name], function(error, authenticated) {
          var redirectUrl = '/';
          var parsedUrl = url.parse(request.url, true);
          
          if (parsedUrl.query && parsedUrl.query[REDIRECT_PARAMETER]) {
            redirectUrl = parsedUrl.query[REDIRECT_PARAMETER];
          }
          
          redirect(response, redirectUrl);
        })
      });
      
      app.get(CALLBACK_PATH, function(request, response) {
        var parsedUrl = url.parse(request.url, true);
        var redirectUrl;
        
        if (parsedUrl.query && parsedUrl.query[REDIRECT_PARAMETER]) {
          redirectUrl = createRedirectUrl(parsedUrl.query[REDIRECT_PARAMETER]);
        } else {
          redirectUrl = createRedirectUrl();
        }
        
        response.render('authenticate', {
          locals: {
            title: 'Authenticate',
            action: redirectUrl
          }
        });
      });
    }));
  };
  
  strategy.createAuthenticateUrl = createRedirectUrl;
  
  return strategy;
};

function failed_validation(request, response, uri) {
  var parsedUrl = url.parse(request.url, true);
  var redirectUrl;
  
  if (uri) {
    redirectUrl = createRedirectUrl(uri);
  } else if (parsedUrl.query && parsedUrl.query[REDIRECT_PARAMETER]) {
    redirectUrl = createRedirectUrl(parsedUrl.query[REDIRECT_PARAMETER]);
  }
  
  redirect(response, redirectUrl);
}

function validate_credentials(executionScope, credentials, request, response, callback) {
  User.findByUser(credentials.user, function(user) {
    if (user) {
      if (user.verifyPassword(credentials.password)) {
        user.authenticated();
        user.save();
        
        executionScope.success({name: credentials.user}, callback);
      } else {
        failed_validation(request, response);
      }
    } else {
      failed_validation(request, response);
    }
  });
}

function redirect(response, url) {
  response.writeHead(303, { 'Location':  url });
  response.end();
}

function createRedirectUrl(redirectTo) {
  if (redirectTo) {
    return CALLBACK_PATH + '?' + REDIRECT_PARAMETER + '=' + redirectTo;
  } else {
    return CALLBACK_PATH;
  }
}