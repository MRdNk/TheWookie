
/*
 * User route
 */

function user () {
  return {
      login: function (req, res) {} // Goes off to github
    , callback: function (req, res) {
        res.redirect('/');
    }
    , logout: function (req, res) {
        req.logout();
        delete req.user;
        res.redirect('/');
    }
  }
}

module.exports = user();