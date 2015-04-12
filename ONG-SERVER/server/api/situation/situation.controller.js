'use strict';

var _ = require('lodash');

var Situation = require('./situation.model');
var User = require('../user/user.model');

function task() {
  console.log("Updating situation");
  var testSituation = new Situation({name : "situation",  timestamp: Date.now(), situation: s});
  testSituation.save(function (err) {
    if (err) { console.log(err); }
    console.log("Situation Saved");
  });
  setTimeout(task, 5000);
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
        if (!situation) {
          console.log("no situation ..." + s);
          situation = new Situation({name: "situation", timestamp: Date.now(), situation: s});
        }
        //

        return res.json(200, situation.situation);
      });
   // }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

var s = {entities:[
  {
    "id": "CMDARMY.0.003",
    "datetime": 1426116529776,
    "type": "area",
    "subtype": "warning",
    "name": "Zone-001",
    "description": null,
    "shape": {
      "type": "area",
      "coords": [
        {
          "lat": 48.9851567648082,
          "lon": 2.2525327883962
        },
        {
          "lat": 48.9743627794255,
          "lon": 2.37587841339621
        },
        {
          "lat": 49.0105451569975,
          "lon": 2.40780316339621
        },
        {
          "lat": 49.018476375828,
          "lon": 2.23898895506287
        }
      ]
    }
  },{
    "id": "CMDARMY.0.002",
    "datetime": 1427493398818,
    "type": "area",
    "subtype": "safe",
    "name": "Zone-SAFE-1",
    "description": "Zone SAFE !! No problemo !",
    "shape": {
      "type": "area",
      "coords": [
        {
          "lat": 48.978451557506,
          "lon": 2.30027202965055
        },
        {
          "lat": 48.9694482450053,
          "lon": 2.27688422787103
        },
        {
          "lat": 48.9615978766418,
          "lon": 2.29640337070957
        },
        {
          "lat": 48.9633296817853,
          "lon": 2.34036540412971
        },
        {
          "lat": 48.9770665383396,
          "lon": 2.31803269115228
        },
        {
          "lat": 48.9746426621947,
          "lon": 2.30818519566617
        }
      ]
    }
  },{
    "id": "CMDARMY.0.004",
    "datetime": 1427493460345,
    "type": "event",
    "subtype": "bomb",
    "name": "Evt-001",
    "description": null,
    "shape": {
      "type": "point",
      "coords": [
        {
          "lat": 48.972103236963456,
          "lon": 2.33579335265402
        }
      ]
    }
  },{
    "id": "CMDARMY.0.008",
    "datetime": 1427494114345,
    "type": "event",
    "subtype": "kidnap",
    "name": "Evt-003",
    "description": null,
    "shape": {
      "type": "point",
      "coords": [
        {
          "lat": 48.968264996524006,
          "lon": 2.343860385786614
        }
      ]
    }
  },{
    "id": "CMDARMY.0.009",
    "datetime": 1427494496046,
    "type": "event",
    "subtype": "dead",
    "name": "Evt-004",
    "description": null,
    "shape": {
      "type": "point",
      "coords": [
        {
          "lat": 48.973171,
          "lon": 2.349839
        }
      ]
    }
  },]};
