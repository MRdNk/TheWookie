var config = require('../config.json')
var postgresWookie = require('postgres-wookie')
// var expressUtils = require('./express/lib/utils')

function routy (serviceLocator) {
  var that = {} // = this

  var sites = {}

  serviceLocator.register('sites', sites)

  postgresWookie({config: config}).sites.selectAll(function (err, data) {
    for(var i=0; i < data.rows.length; i++) {
      serviceLocator.app.get('/' + data.rows[i].name, function (req, res) {
        // res.send('I found it!')
        var site = fetchSiteByRequestReoute(req);
        res.render('site', {
          title: site.name
        })
      })
      var site = data.rows[i]
      serviceLocator.sites[site.name] = site
    }
  })

  serviceLocator.app.get('/sites/getAll', getAll)
  serviceLocator.app.get('/sites/add', addSite)

  function addSite (req, res) {

    var site = {
        name: req.query.name
      , created_by_user_id: req.query.user_id
    }

    postgresWookie({config: config}).sites.insert(site, function (err, data) {
      if (!err) serviceLocator.sites[site.name] = site
      res.send('data: ', data || err)
    })

    serviceLocator.app.get('/' + site.name, function (req, res) {
      // res.send('I found a new one')
      var site = fetchSiteByRequestReoute(req);
      res.render('site', {
        title: site.name
      })
    })

  }

  function getAll (req, res) {
    postgresWookie({config: config}).sites.selectAll(function (err, data) {
      res.send('data: ', data.rows || err)
    })
  }

  function fetchSiteByRequestReoute(req) {
    var siteName = req.route.path.split('/')[1]
    var site = serviceLocator.sites[siteName]
    return site;
  }

}

module.exports = routy;