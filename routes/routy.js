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
        var site = fetchSiteByRequestRoute(req);
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
  serviceLocator.app.get('/:site/people', people)

  /* site creation */
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
      var site = fetchSiteByRequestRoute(req);
      res.render('site', {
        title: site.name
      })
    })

  }

  /* list all the sites (json) */
  function getAll (req, res) {
    postgresWookie({config: config}).sites.selectAll(function (err, data) {
      if (err) res.send('data: ', err)
      else {
        var sites = {}
        for (var i = 0; i < data.rows.length; i++) {
          var name = data.rows[i].name
          sites[name] = data.rows[i];
          sites[name].pages = { index: 'index.html' }
          sites[name].sites = { people: '/people/' }
        }
        res.send('data: ', sites)
      }
      // res.send('data: ', data.rows || err)
    })
  }

  function fetchSiteByRequestRoute(req) {
    var siteName = req.route.path.split('/')[1]
    var site = serviceLocator.sites[siteName]
    return site
  }

  function people (req, res) {
    var site = req.params.site;
    if (serviceLocator.sites[site] !== undefined) {
      res.render('people', {
        title: site + ': people'
      })  
    }
    else 
      res.send(404, 'Cannot GET ' + req.url)
      // res.send('not found')
  }
}

module.exports = routy;