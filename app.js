
/**
 * Module dependencies.
 */
var express = require('express')
var routes = require('./routes')
var user = require('./routes/user')
var http = require('http')
var path = require('path')
var config = require('./config.json')
var passport = require('passport')
GitHubStrategy = require('passport-github').Strategy

var setupPassport = require('./setupPassport')(passport) // Sets up github authentication via Passport.js

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.cookie.secret));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* Github Login / logout */
app.get('/login', passport.authenticate('github', {scope: 'repo'}), user.login);
app.get('/logout', user.logout);
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), user.callback);

// Application Routes
app.get('/', routes.index);
app.get('/data', routes.second)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
