'use strict';

var request = require("request");
var _ = require('lodash');

var Report = require('./report.model');
var User = require('../user/user.model');

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

          //SEND REPORT TO WEBC2
          request({
            uri: "http://localhost:9000/api/location/test",
            method: "PUT",
            timeout: 10000,
            json: {report: report.report_data}
          }, function (error, response, body) {
            console.log(body);
          });

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
