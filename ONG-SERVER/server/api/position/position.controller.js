'use strict';

var User = require('../user/user.model');

//Update the position of a user 
exports.update = function(req, res) {
  
  var userEmail = req.body.email;
  var newPosition = req.body.position;
  var userPassword = req.body.password; //TODO change/check instead the token and not the password

  User.findOne({ email: userEmail}, function (err, user){
    if (err) return res.json(err);
    if (!user) return res.send(401);
    if(user.authenticate(userPassword)) {
      user.last_known_position = "newPosition";
      user.last_update_timestamp = Date.now();
      user.save(function(err) {
        if (err){
          console.log(err);
        };
        res.json(user);
      });
    } else {
      res.send(403);
    }
   
  });

};


function handleError(res, err) {
  return res.send(500, err);
}