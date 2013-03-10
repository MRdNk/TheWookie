
/*
 * GET home page.
 */
var fs = require('fs')
var jsonParse = require('JSONStream')
var config = require('../config.json')
var postgresWookie = require('postgres-wookie')

exports.second = function(req, res){

  var s = postgresWookie({config: config}).application.select();
  var parser = jsonParse.stringify(false)
  s.pipe(parser).pipe(res)

};

exports.index = function (req, res) {
  postgresWookie({config: config}).application.select(function (err, data) {
    console.log(data)
    res.render('index', {title: 'TheWookie', apps: data.rows, user: req.user || 'none'})
  });
}