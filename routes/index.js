/*
 * GET home page.
 */

var fs = require('fs')
var jsonParse = require('JSONStream')
var config = require('../config.json')
var postgresWookie = require('postgres-wookie')

exports.json = function(req, res){

  var s = postgresWookie({config: config}).application.select();
  var parser = jsonParse.stringify(false)
  s.pipe(parser).pipe(res)

};

exports.index = function (req, res) {
  postgresWookie({config: config}).application.select(function (err, data) {
    // console.log(data)
    res.render('index', {title: 'TheWookie', apps: data.rows})
  });
}

function applications () {



}

function sites (req, res) {

  console.log(req.route)

  var site = {
      name: req.query.name
    , created_by_user_id: req.query.user_id
  }

  postgresWookie({config: config}).sites.insert(site, function (err, data) {
    res.send('data: ', data || err)
  })

}

exports.sites = sites