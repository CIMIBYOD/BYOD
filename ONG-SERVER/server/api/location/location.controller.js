'use strict';

var request = require("request");
var _ = require('lodash');
var User = require('../user/user.model');

// Updates an existing location in the DB.
exports.update = function(req, res) {

  var userEmail = req.body.email;
  var newPosition = req.body.position;
  var userPassword = req.body.password; //TODO change/check instead the token and not the password

  User.findOne({ email: userEmail}, function (err, user){
    if (err) return res.json(err);
    if (!user) return res.send(401);
    if(user.authenticate(userPassword) && !user.is_revoqued) {
      user.last_known_position = "newPosition";
      user.last_update_timestamp = Date.now();
      user.save(function(err) {
        if (err){
          console.log(err);
        };

        //SEND LOCATION TO WEBC2
        request({
          uri: "http://localhost:9000/api/location/test",
          method: "PUT",
          timeout: 10000,
          json: {foo: "bar", woo: "car"}
        }, function(error, response, body) {
          console.log(body);
        });

        res.json(user);
      });
    } else {
      res.send(403);
    }

  });
};

exports.test = function(req, res) {
  res.json("toto");
}



function handleError(res, err) {
  return res.send(500, err);
}
