'use strict';

var request = require("request");
var _ = require('lodash');

var Report = require('./report.model');
var User = require('../user/user.model');
var Configuration = require('../configuration/configuration.model');

/* GETTING CONFIGURATION */
var CURRENT_CONFIG_KEY = "current";
var configuration = undefined;
var init = function(){
  Configuration.findOne({
    name: CURRENT_CONFIG_KEY
  },function (err, configurations) {
    if(err) { return handleError(res, err); }
    configuration = configurations;
    console.log( configurations);
  });
  Configuration.schema.post('save', function (doc) {
    configuration = doc;
    console.log("configuration update");
  });
}();
/* END CONFIG INIT */

// Get list of reports
exports.index = function(req, res) {
  Report.find(function (err, reports) {
    if(err) { return handleError(res, err); }
    return res.json(200, reports);
  });
};

// Get a single report
exports.show = function(req, res) {
  Report.findById(req.params.id, function (err, report) {
    if(err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
    return res.json(report);
  });
};

// Creates a new report in the DB.
exports.create = function(req, res) {
  var report_data_input = req.body.report;
  var userEmail = req.body.email;
  var userPassword = req.body.password; //TODO change/check instead the token and not the password

  User.findOne({ email: userEmail}, function (err, user) {
    if (err) return res.json(err);
    if (!user) return res.send(401);
    if (user.authenticate(userPassword) && !user.is_revoqued) {

      if (report_data_input) {
        var report = new Report({timestamp: Date.now(), report_data: report_data_input});
        report.save(function (err) {
          if (err) {
            return handleError(res, err);
          }

          //SEND LOCATION TO WEBC2
          if(configuration && configuration.server_host){
            var ws_location_c2 = "http://" + configuration.server_host + situation_ws  +"/" + configuration.situation_from;
            request({
              uri: ws_location_c2,
              method: "PUT",
              timeout: 10000,
              json: {json: {report: report.report_data}}
            }, function(error, response, body) {
              console.log(body);
            });
          }else{
            console.log("No config : can't send report to C2");
          }
          return res.json(200, report);
        });
      }
    }
  });

};

// Deletes a report from the DB.
exports.destroy = function(req, res) {
  Report.findById(req.params.id, function (err, report) {
    if(err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
    report.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
