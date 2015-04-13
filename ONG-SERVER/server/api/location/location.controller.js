'use strict';

var request = require("request");
var _ = require('lodash');
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

        //SEND LOCATION TO WEBC2
        var jsonCoords = {"coords":[{"lat":user.last_known_position.latitude, "lon":user.last_known_position.longitude}]};
        var jsonCoordsString = JSON.stringify(jsonCoords).replace("\"","\\\"")
        if(configuration && configuration.server_host){
          var ws_location_c2 = "http://" +configuration.server_host + configuration.location_ws + configuration.situation_from+"/"+user.name;
          request({
            uri: ws_location_c2,
            method: "PUT",
            timeout: 10000,
            json: {location: jsonCoordsString}
          }, function(error, response, body) {
            if(error){
              console.log("Location not pushed to C2 : " + error.code +" = "+ error.hostname);
            }
          });
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
