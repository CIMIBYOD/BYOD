'use strict';

var _ = require('lodash');
var Configuration = require('./configuration.model');

var CURRENT_CONFIG_KEY = "current";

// Get the current configuration
exports.index = function(req, res) {
  Configuration.findOne({
    name: CURRENT_CONFIG_KEY
  },function (err, configurations) {
    if(err) { return handleError(res, err); }
    return res.json(200, configurations);
  });
};

// Creates a new configuration in the DB.
exports.create = function(req, res) {
  Configuration.create(req.body, function(err, configuration) {
    if(err) { return handleError(res, err); }
    return res.json(201, configuration);
  });
};

// Updates an existing configuration in the DB or Create
exports.update = function(req, res) {

    Configuration.findOne({
      name: CURRENT_CONFIG_KEY
    }, function (err, configuration) {
    if (err) { return handleError(res, err); }
    var config = null;
    if(!configuration) {
      config = new Configuration({name : CURRENT_CONFIG_KEY});
      _.merge(config, req.body);
      config.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, configuration);
      });
    }
    else{
      var updated = _.merge(configuration, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, configuration);
      });
    }

  });
};


function handleError(res, err) {
  return res.send(500, err);
}
