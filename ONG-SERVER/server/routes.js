/**
 * Main application routes
 */

'use strict';

var express = require('express');
var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/report', require('./api/report'));
  app.use('/api/situation', require('./api/situation'));
  app.use('/api/configuration', require('./api/configuration'));
  app.use('/api/location', require('./api/location'));
  app.use('/api/xmpp', require('./api/xmpp'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.use('/export',express.static(__dirname + '/export'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets|export)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });


};
