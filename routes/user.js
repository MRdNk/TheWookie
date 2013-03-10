
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function (req, res) {} // Goes off to github

exports.callback = function (req, res) {
  res.redirect('/');
}

exports.logout = function (req, res) {
  req.logout();
  delete req.user;
  res.redirect('/');
}