var config = require('./config.json')

module.exports = function setup (passport) {

  // Passport Session Setup
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Use the Gihub Strategy within Passport
  passport.use(new GitHubStrategy({
      clientID: config.github.CLIENT_ID,
      clientSecret: config.github.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ['user, repo']
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      // req.session.github_token = accessToken;
      // console.log(accessToken, ' : ', refreshToken);
      process.nextTick(function () {
        
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        return done(null, profile, accessToken);
      });
    }
  ));

}