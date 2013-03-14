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

  serviceLocator.app.get('/sites/getAll', getAll) // Returns a json of all the sites
  
  serviceLocator.app.get('/sites/create', createSite) // get - Form to create a site
  serviceLocator.app.post('/sites/add', addSite)      // post - Actually creates the site

  function createSite (req, res) {

    res.render('sites/create', {
      title: 'Create Site'
    })

  }

  function addSite (req, res) {

    var site = {
        name: req.body.name
      , created_by_user_id: req.body.user_id
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
      if (err) res.send('data: ', err)
      else {
        var sites = {}
        for (var i = 0; i < data.rows.length; i++) {
          var name = data.rows[i].name
          sites[name] = data.rows[i];
          sites[name].pages = {index: 'index.html'}
          sites[name].sites = {people: 'people.html'}
        }
        res.send('data: ', sites)
      }
      // res.send('data: ', data.rows || err)
    })
  }

  function fetchSiteByRequestReoute(req) {
    var siteName = req.route.path.split('/')[1]
    var site = serviceLocator.sites[siteName]
    return site;
  }

}

module.exports = routy;