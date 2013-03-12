var config = require('../config.json')
var postgresWookie = require('postgres-wookie')

function routy () {

  return {
      dbFetch: dbFetch
    // , routes: routes 
    // , add: add
  }

  function dbFetch (app) {
    postgresWookie({config: config}).sites.selectAll(function (err, data) {
      for(var i=0; i < data.rows.length; i++) {
        app.get('/' + data.rows[i].name, function (req, res) {
          res.send('I found it!')
        })
        // routes[data.rows[i].name] = {path: }
      }
    })
  }

  routes: {

  }



}

module.exports = routy;