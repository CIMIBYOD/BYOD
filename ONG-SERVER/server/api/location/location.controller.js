'use strict';
//TOOLS IMPORT
var http = require('http');
var request = require("request");
var _ = require('lodash');

//MODEL IMPORT
var User = require('../user/user.model');
var Configuration = require('../configuration/configuration.model');

/* GETTING INT CONFIGURATION */
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

// Updates an existing location in the DB.
exports.update = function(req, res) {

  var userEmail = req.body.email;
  var newPosition = req.body.location;
  var userPassword = req.body.password; //TODO change/check instead the token and not the password

  User.findOne({ email: userEmail}, function (err, user){
    if (err) return res.json(err);
    if (!user) return res.send(401);
    if(user.authenticate(userPassword) && !user.is_revoqued) {

      user.last_known_position = newPosition;
      user.last_update_timestamp = Date.now();

      user.save(function(err) {
        if (err){
          console.log(err);
        }

		var latC2 = user.last_known_position.latitude+"";
		var latC2Safe = latC2.replace(".",",");
		var lonC2 = user.last_known_position.longitude+"";
		var lonC2Safe = lonC2.replace(".",",");
        //SEND LOCATION TO WEBC2
        var jsonCoords = {"coords":[{"lat":latC2Safe+"", "lon":lonC2Safe+""}]};
        var jsonCoordsString = JSON.stringify(jsonCoords).replace("\"","\\\"");
		
		jsonCoordsString = {location:jsonCoordsString};
        jsonCoordsString = JSON.stringify(jsonCoordsString);
        jsonCoordsString = jsonCoordsString.replace("\\\\\\","\\");
				
		console.log(jsonCoordsString);
        if(configuration && configuration.server_host){
			try{
			  var ws_location_c2 = "http://" +configuration.server_host + configuration.location_ws + configuration.situation_from+"/"+user.name.replace(/ /g, '');
			  console.log(ws_location_c2);
			  var headers = {
				  'Content-Type': 'application/json',
				  'Content-Length': jsonCoordsString.length
				};

				var options = {
				  host: 'webc2.defense.gouv.fr',
				  port: 8585,
				  path: configuration.location_ws + configuration.situation_from+"/"+user.name.replace(/ /g, ''),
				  method: 'PUT',
				  headers: headers
				};

				// Setup the request.  The options parameter is
				// the object we defined above.
				var req = http.request(options, function(res) {
				  res.setEncoding('utf-8');

				  var responseString = '';

				  res.on('data', function(data) {
					responseString += data;
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

				req.write(jsonCoordsString);
				req.end();
			}catch(err){
				console.log("An error occurred while sending to the C2");
				console.log(err);
			}
			
        }else{
          console.log("NO CONFIG : can't send location to C2");
        }
        res.json(user);
      });
    } else {
      if(user.is_revoqued){
        res.json("revoked");
      }else {
        res.send(403);
      }
    }
  });
};

function handleError(res, err) {
  return console.log(err);
}
