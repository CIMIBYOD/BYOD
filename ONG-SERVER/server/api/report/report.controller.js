'use strict';

var http = require('http');
var request = require("request");
var _ = require('lodash');
var fs = require("fs");

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
  });
  Configuration.schema.post('save', function (doc) {
    configuration = doc;
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

		var report_json = JSON.parse(report_data_input);
		console.log(report_json.type);
		var report_data_input_json;
		try{
			report_data_input_json = JSON.parse(report_data_input);
		}catch(err){
			console.log(err);
		}
		if (!report_data_input_json) return res.send(500);
		
		var report = new Report({timestamp: Date.now()});
		
        if(report_data_input_json !== undefined && report_data_input_json.picture!== undefined && report_data_input_json.picture !== "none") {
          var filename = save_image( report._id, report_data_input_json.picture);
          report_data_input_json.picture = filename;
		  
        }
        report.report_data = report_data_input_json;
		console.log(report.report_data);
        report.save(function (err) {
          if (err) {
            return handleError(res, err);
          }

          //SEND LOCATION TO WEBC2
          if(configuration && configuration.server_host){
			  try{
				var ws_alert_c2 = "http://" + configuration.server_host + configuration.alert_ws + configuration.situation_from;

				var reportC2 = JSON.stringify(report.report_data).replace("\"","\\\"");
				reportC2 = {report:reportC2};
				reportC2 = JSON.stringify(reportC2);
				reportC2 = reportC2.replace("\\\\\\","\\");

				console.log(ws_alert_c2);
				console.log(reportC2);
		
				var headers = {
				  'Content-Type': 'application/json',
				  'Content-Length': reportC2.length
				};

				var options = {
				  host: 'webc2.server',
				  port: 8585,
				  path: '/TOMSDataService.svc/bso/cimicop/report/FromCivilian',
				  method: 'POST',
				  headers: headers
				};

				// Setup the request.  The options parameter is
				// the object we defined above.
				var req = http.request(options, function(res) {
				  res.setEncoding('utf-8');

				  var responseString = '';

				  res.on('data', function(data) {
					responseString += data;
					console.log(data);
				  });

				  res.on('end', function() {
					var resultObject = JSON.parse(responseString);
					console.log(resultObject);
				  });
				});

				req.on('error', function(e) {
				  // TODO: handle error.
				  console.log(e);
				});

				req.write(reportC2);
				req.end();
			  }catch(err){
				  console.log(err);
			  }
          }else{
			console.log("An error occurred while sending to the C2");
            console.log("No config : can't send report to C2");
          }
          return res.json(200, report);
        });
      }
    } else {
      if(user.is_revoqued){
        res.json("revoked");
      }else {
        res.send(403);
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


function save_image(id, base64Data){

  // Regular expression for image type:
  // This regular image extracts the "jpeg" from "image/jpeg"
  var imageTypeRegularExpression = /\/(.*?)$/;
  var imageBuffer = decodeBase64Image(base64Data);
  var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
  var userUploadedImagePath  = "server/export/" + id +  '.' + imageTypeDetected[1];

  // Save decoded binary image to disk
  try
  {
    require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
      function()
      {
        console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
      });
    return id +  '.' + imageTypeDetected[1];
  }
  catch(error)
  {
    console.log('ERROR:', error);
    return undefined;
  }
}

// Decoding base-64 image
// Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
function decodeBase64Image(dataString)
{
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3)
  {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}




