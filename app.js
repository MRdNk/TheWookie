
/**
 * Module dependencies.
 */

// Standard Express dependencies
var express = require('express')
var routes = require('./routes')
var user = require('./routes/user')
var http = require('http')
var path = require('path')

var serviceLocator = require('service-locator').createServiceLocator()

var RedisStore = require('connect-redis')(express)

// Config object setup to move 'sensitive' information outside of anything committed to github
var config = require('./config.json')

// Passport.js library & github 'strategy' (github flavoured Passport.js)
var passport = require('passport')

var setupPassport = require('./setupPassport')(passport) // Sets up github authentication via Passport.js

var app = express(); // Create an 'app' - Standard Express

// Add some configuration
app.configure(function(){

  // Standard express middleware
  app.set('port', process.env.PORT || 3000); // Set the default port to 3000, can be overridden by passing in env.PORT
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.cookie.secret));
  app.use(express.session({store: new RedisStore, secret: config.cookie.secret}));

  // Set up passport - for github authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // set some locals - custom
  app.use(function (req, res, next) {
    res.locals.user = req.user || {}
    res.locals.isAuthenticated = (req.user) ? true : false
    next();
  })

  app.use(app.router); // Application Routing
  app.use(express.static(path.join(__dirname, 'public'))); // Static directory - for static files
});

// Development configuration options, not run when in 'production' mode.
app.configure('development', function(){
  app.use(express.errorHandler());
});

/* Github Login / logout: Part of Passport.js */
app.get('/login', passport.authenticate('github', {scope: 'repo'}), user.login);
app.get('/logout', user.logout);
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), user.callback);

// Application Routes
app.get('/', routes.index);
app.get('/json', routes.json);

app.get('/edit', routes.edit)
// app.get('/a/:b/people', routes.people)

serviceLocator.register('app', app)

var routy = require('./routes/routy')(serviceLocator)

console.log(app.routes)


// Create an http server and listen on a port.
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
