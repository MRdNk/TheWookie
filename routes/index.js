
/*
 * GET home page.
 */
var fs = require('fs')
var config = require('../config.json')
var postgresWookie = require('postgres-wookie')

postgresWookie({config: config}, function (err, done) {
  if (err) 
    console.error(err)
  else
    console.log(done)
})

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};