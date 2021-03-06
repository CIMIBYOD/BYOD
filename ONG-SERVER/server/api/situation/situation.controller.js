'use strict';
var request = require("request");
var _ = require('lodash');

//Mongoose Models for the object used
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
  //Listen for updates on the configuration 
  Configuration.schema.post('save', function (doc) {
    configuration = doc;
    console.log("configuration update");
  });
}();

/*
* Function requesting update from the C2
* Refresh time is defined in config (configuration.situation_sync) or is by default 5000 ms
*/
function task() {
  //GET SITUATION FROM WEBC2
  if(configuration && configuration.server_host){
	  try{
			//WebService URL to connect to the C2
			var ws_situation_c2 = "http://" + configuration.server_host + configuration.situation_ws + configuration.situation_to;
			console.log(ws_situation_c2);
			
			//GET request and saving the result in the situation Object stored in the DB
			request({
			  uri: ws_situation_c2,
			  method: "GET",
			  timeout: 10000
			}, function(error, response, body) {
				if(error){
					console.log(error);
				}
				  if(body) {
					body = body.replace("},]", "}]");
					var data = JSON.parse(body);
					//Creating new object Situation and save it
					var situation = new Situation({name: "situation", timestamp: Date.now(), situation: data});
					situation.save(function (err) {
					  if (err) {
						console.log(err);
					  }
					  console.log("Situation Saved");
					});
				  }
			});
		}catch(err){
			console.log("An error occurred while getting data from the C2");
			console.log(err);
		}
  }else{
    console.log("No config : can't get situation from C2");
  }

  //Launch the next request for the update task
  if(configuration){
    setTimeout(task, (configuration.situation_sync * 1000));
  }else{
    setTimeout(task, 5000); //Default value
  }

}
//Launch the first update task
task();

/*
* Webservice function: Get Current situation
* Args in JSON Body of the POST:
* - email: Login of the user
* - password : Password of the user
* Return the last situation saved in the DB
* NOTE: TODO: change/check instead the token and not the password
*/
exports.get = function(req, res) {

  var userEmail = req.body.email;
  var userPassword = req.body.password; //TODO 

  User.findOne({ email: userEmail}, function (err, user) {
    if (err) return res.json(err);
    if (!user) return res.send(401);
    //if (user.authenticate(userPassword) && !user.is_revoqued) {

      Situation.find().sort({_id: 'descending'}).limit(1).find(function (err, situations) {
        if (err) {
          return handleError(res, err);
        }
        var situation = situations[0];
        if(situation){
          return res.json(200, situation.situation);
        }else {
          return res.json(404);
        }
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
