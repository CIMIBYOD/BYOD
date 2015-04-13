'use strict';
var request = require("request");
var _ = require('lodash');

var Situation = require('./situation.model');
var User = require('../user/user.model');
var Configuration = require('../configuration/configuration.model');

/* GETTING CONFIGURATION */
var CURRENT_CONFIG_KEY = "current";
var configuration = undefined;
var initConfig = function(){
  Configuration.findOne({
    name: CURRENT_CONFIG_KEY
  },function (err, configurations) {
    if(err) { return handleError(res, err); }
    configuration = configurations;
    console.log( configuration);
  });
  Configuration.schema.post('save', function (doc) {
    configuration = doc;
    console.log("configuration update");
  });
}();

function task() {
  //GET SITUATION FROM WEBC2
  if(configuration && configuration.server_host){
    var ws_situation_c2 = "http://" + configuration.server_host + configuration.situation_ws  +"/" + configuration.situation_to;
    request({
      uri: ws_situation_c2,
      method: "GET",
      timeout: 10000
    }, function(error, response, body) {

      if(body) {
        body = body.replace("},]", "}]");
        var data = JSON.parse(body);

        var situation = new Situation({name: "situation", timestamp: Date.now(), situation: data});
        situation.save(function (err) {
          if (err) {
            console.log(err);
          }
          //console.log("Situation Saved");
        });
      }
    });
  }else{
    console.log("No config : can't get situation from C2");
  }

  if(configuration){
    setTimeout(task, (configuration.situation_sync * 1000));
  }else{
    setTimeout(task, 5000); //Default value
  }

}
task();

// Get current situation
exports.get = function(req, res) {

  var userEmail = req.body.email;
  var userPassword = req.body.password; //TODO change/check instead the token and not the password

  User.findOne({ email: userEmail}, function (err, user) {
    if (err) return res.json(err);
    if (!user) return res.send(401);
    //if (user.authenticate(userPassword) && !user.is_revoqued) {

      Situation.find().sort({_id: 'descending'}).limit(1).find(function (err, situations) {
        if (err) {
          return handleError(res, err);
        }
        var situation = situations[0];
        return res.json(200, situation.situation);
      });
    // } else {
    //if(user.is_revoqued){
    //  res.json("revoked");
    //}
    //res.send(403);
    //}
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
