'use strict';

angular.module('ongServerApp')
  .controller('SituationCtrl', function ($scope, $http, $modal, User, Auth, socket, leafletData) {

    $scope.user = Auth.getCurrentUser();

    /*************************************/
    /********   Configuration    ********/
    /**************************************/
    var config = {
      debug: true,
      //which src to choose for map server (see below)
      mapSrc: "afghaTiled",
      //which report url to choose to create reports (see below)
      reportUrl: "demo",
      map: {
        france: {
          location: new L.LatLng(48.85, 2.4),
          zoomLevel: 10
        },
        //untiled afghanistan map
        afgha: {
          location: new L.LatLng(34.59, 69.8),
          mapUrl: 'http://192.168.1.130/arcgis/rest/services/SWContest/Afghanistan/MapServer',
          zoomLevel: 12
        },
        //tiled afghanistan map
        afghaTiled: {
          location: new L.LatLng(34.59, 69.8),
          mapUrl: 'http://192.168.1.102/arcgis/services/Contestreduit/MapServer/WMSServer',
          layers: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33',
          zoomLevel: 12
        }
      }
    };

    $scope.current_situation = undefined;
    $scope.reports = undefined;

    $scope.users = User.query();
    $scope.users.$promise.then(function () {
      $scope.initUsersMarkers();
    });


    $http.get('/api/report').success(function (reports) {
      if (reports) {
        $scope.reports = reports;
        leafletData.getMap().then(function (map) {
          if($scope.reports){
            for(var i=0; i<$scope.reports.length; i++){
              var r = $scope.reports[i];
              if(r.report_data){
                try{
                  var bso = r.report_data;
                  bso.id = r._id;
                  _addBso(bso,map, 0.5);
                } catch (reason) {
                  console.log("JSON ERROR :" + reason);
                  console.log(bso);

                }

              }
            }
          }
        });
      }
    });

    socket.syncUpdates('report', $scope.reports, function (event, item, array) {

      var report = item;
      if (event === "updated") {
        leafletData.getMap().then(function (map) {
          if(report.report_data){
            var bso = report.report_data;
            bso.id = report._id;
            _addBso(bso,map, 0.5);
          }
        });
      }
    });


    $scope.local_icons = {
      default_icon: {},
      user_green_icon: {
        iconUrl: 'assets/icon/Localisation_user_ok.png',
        iconSize: [42, 42]
      },
      user_green_gray: {
        iconUrl: 'assets/icon/Localisation_user_nok.png',
        iconSize: [42, 42]
      },
      user_green_red: {
        iconUrl: 'assets/icon/ic_action_user_red.png',
        iconSize: [42, 42]
      }
    };

    $scope.usersMarkers = {};

    $('#map').on('click', '.trigger', function (event) {
      console.log(event.target.id);
      $scope.broadcastMessage(event.target.id);
    });

    socket.syncUpdates('user', $scope.users, function (event, item, array) {

      var user = item;
      if (event === "updated") {
		    var html = "<div class=\"panel panel-primary\">";
			html +="<div class=\"panel-heading\"><h4>"+user.name.toUpperCase()+"</h4></div>";
			html +="<div class=\"panel-body\">";
			html +="<label>Login : "+ user.email + "</label><br/>";
			html +="<label>Last Update: "+ $scope.convertTimeStamp(user.last_update_timestamp) + "</label><br/>";
			html +="<label>Latitude : "+ user.last_known_position.latitude + "</label><br/>";
			html +="<label>Longitude : "+ user.last_known_position.longitude + "</label><br/>";
			html +="<button id=\"" + user.email + "\" class=\"btn btn-default trigger\"><span class=\"glyphicon glyphicon-comment\"></span> Send Message</button>";
			html +="</div>";
			html += "</div>";
			
        $scope.usersMarkers[user._id] = {
          lat: user.last_known_position.latitude,
          lng: user.last_known_position.longitude,
          message: html,
          icon: $scope.local_icons.user_green_icon
        }
      }
    });

    $scope.initUsersMarkers = function () {

      for (var i = 0; i < $scope.users.length; i++) {
        var user = $scope.users[i];
        if (user.last_known_position !== undefined) {
          console.log(user.last_known_position);
		  
		  var iconUserSate = undefined;
		  if(Date.now() - user.last_known_position > (1000*60*60)){
			  iconUserSate = $scope.local_icons.user_green_icon;
		  }else{
			  iconUserSate = $scope.local_icons.user_green_gray;
		  }
		  
		   var html = "<div class=\"panel panel-primary\">";
			html +="<div class=\"panel-heading\"><h4>"+user.name.toUpperCase()+"</h4></div>";
			html +="<div class=\"panel-body\">";
			html +="<label>Login : "+ user.email + "</label><br/>";
			html +="<label>Last Update: "+ $scope.convertTimeStamp(user.last_update_timestamp) + "</label><br/>";
			html +="<label>Latitude : "+ user.last_known_position.latitude + "</label><br/>";
			html +="<label>Longitude : "+ user.last_known_position.longitude + "</label><br/>";
			html +="<button id=\"" + user.email + "\" class=\"btn btn-default trigger\"><span class=\"glyphicon glyphicon-comment\"></span> Send Message</button>";
			html +="</div>";
			html += "</div>";
		
          $scope.usersMarkers[user._id] = {
            lat: user.last_known_position.latitude,
            lng: user.last_known_position.longitude,
            message: html,
            icon: $scope.local_icons.user_green_icon
          }
        }
      }
      leafletData.getMap().then(function (map) {
        if (config.mapSrc == 'afghaTiled') {
          map.setView(config.map.afghaTiled.location, config.map.afghaTiled.zoomLevel);
          L.tileLayer.wms(config.map.afghaTiled.mapUrl, {
            layers: config.map.afghaTiled.layers
          }).addTo(map);
        }
      });
    };

    socket.syncUpdates('situation', undefined, function (event, item, array) {
      $scope.updateSituation(item.situation)
    });

    $scope.updateSituation = function (newSituation) {

      leafletData.getMap().then(function (map) {
        if ($scope.current_situation) {
          for (var i = 0; i < $scope.current_situation.entities.length; i++) {
            var bso = $scope.current_situation.entities[i];
            removeBso(bso.id, map);
          }
        }
        $scope.current_situation = newSituation;
        if ($scope.current_situation) {
          for (var i = 0; i < $scope.current_situation.entities.length; i++) {
            var bso = $scope.current_situation.entities[i];
            _addBso(bso, map);
          }
        }
      });
    };

    $scope.refresh = function () {
      console.log("refresh" + $scope.user.email + " " + $scope.user.password);
      $http.post('/api/situation', {email: $scope.user.email, password: $scope.user.password})
        .success(function (situation) {
          if (situation) {
            $scope.updateSituation(situation);
          } else {
            console.log("no situation");
          }
        }).error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(status + " " + data);
        });
    };
    $scope.refresh();
	
	$scope.convertTimeStamp = function(timestamp){
		if(timestamp === undefined || timestamp === "now"){
			return "";
		}
		  var newDate = new Date();
		  newDate.setTime(timestamp);
		  return newDate.toUTCString();
    }


    /**********     Cache class    *********/
    var Cache = (function () {
      function Cache() {
        this._cache = {};
      }

      Cache.prototype.put = function (key, value) {
        var normalizedKey = normalizeKey(key);
        var current = this._cache[normalizedKey];
        this._cache[normalizedKey] = value;
        return current;
      };

      Cache.prototype.get = function (key) {
        var normalizedKey = normalizeKey(key);
        return this._cache[normalizedKey];
      };


      Cache.prototype.remove = function (key) {
        var normalizedKey = normalizeKey(key);
        var current = this._cache[normalizedKey];
        if (current !== undefined) {
          delete this._cache[normalizedKey];
        }
        return current;
      };

      var normalizeKey = function (key) {
        return "$" + key.replace(/\W/g, '_');
      }
      return Cache;
    })();
    $scope.cache = new Cache();



    $scope.broadcastMessage = function (toValue) {
      console.log("broadcast");
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          to: function () {
            return toValue;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
      });
    };


    /*
     -------------------------------------------
     CODE FROM ANDROID APP
     -------------------------------------------
     */
    /**********     removeBso     *********/

    //remove bso from map
    var removeBso = function (id, map) {

      if (id) {
        var layer = $scope.cache.remove(id);
        if (layer) {
          map.removeLayer(layer);
        }
      }
    }

    /**********     updateBso     *********/

    //update bso from map
    var updateBso = function (bsoJson) {

      var bso = JSON.parse(bsoJson);
      //remove and create a new one
      removeBso(bso.id);
      addBso(bsoJson);
    }

    var _addBso = function (bso, map, opacity) {
      if(opacity === undefined){
        opacity = 1;
      }

      var layer;
      if (bso.type == "event" || bso.type == "observation") {

        layer = _toMarker(bso, opacity);
        if (layer != undefined) {
          layer.addTo(map);
          $scope.cache.put(bso.id, layer);
        }

      } else if (bso.type == "area") {

        layer = _toPolygon(bso);
        if (layer != undefined) {
          layer.addTo(map);
          $scope.cache.put(bso.id, layer);
        }

      }
    };


    var _toPolygon = function (bso) {
      try {
        var edges = [];
        for (var i = 0; i < bso.shape.coords.length; i++) {
          if (bso.shape.coords[i] !== null) {
            edges.push(L.latLng(bso.shape.coords[i].lat, bso.shape.coords[i].lon));
          }
        }
        var color;
        if (bso.subtype == 'danger') {
          color = "#ff0000";
        }
        else if (bso.subtype == 'warning') {
          color = "#FF8100";
        }
        else if (bso.subtype == 'safe') {
          color = "#00b35a";
        }
        else {
          color = "#ff0000";
        }
        return _bindPopup(L.polygon(edges, {weight: 1, color: color}), bso);

      } catch (reason) {
        _log("ERROR: unable to transform area to polygone with reason :" + reason);
      }
    };

    //add popup info to bso
    var _bindPopup = function (layer, bso) {
      try {
        console.log("bso.datetime is " + typeof(bso.datetime));
        var validity = new Date(parseInt(bso.datetime)).toDateString();
		
		var html = "<div class=\"panel panel-primary\">";
		html +="<div class=\"panel-heading\"><h4>"+bso.name+":</h4></div>";
		html +="<div class=\"panel-body\">";
		if(bso.description || bso.description !== "none"){
          html += "<b>"+ bso.description +"</b>";
        }
		if(bso.picture){
          html += "<img width=\"200px\" src=\"export/"+ bso.picture + "\"></img>";
        }
		
		html +="</div>";
		html += "</div>";
        return layer.bindPopup(html); // "<h5><b>" + bso.name + "</b></h5><br>" + "<b>report date : " + validity + "</b><br>" + bso.description);
      } catch (e) {
        console.log(e);
      }
    };

    var _toMarker = function (bso, o) {
      try {
        return _bindPopup(L.marker(L.latLng(bso.shape.coords[0].lat, bso.shape.coords[0].lon), {icon: markerIcons[bso.subtype], opacity: o}), bso);
      } catch (reason) {
        _log("ERROR: unable to transform ponctual to Marker with reason :" + reason);
      }
    };


    /*
     * -------------------------------------------------------
     *  DEFINE VALUES
     * -------------------------------------------------------
     */

    var markerIcons = {};
    var icon = L.icon({
      iconUrl: 'assets/icon/armed-group-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["armed-group"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/death-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["death"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/injured-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["injured"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/kidnap-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["kidnap"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/other-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["other"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/riot-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["riot"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/tank-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["tank"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/bomb-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["bomb"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/aircraft-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["aircraft"] = icon;

    icon = L.icon({
      iconUrl: 'assets/icon/helico-marker.png',
      popupAnchor: [1, -16],
      iconSize: [32, 32]
    });
    markerIcons["helico"] = icon;

  });



angular.module('ongServerApp').controller('ModalInstanceCtrl', function ($scope, $http, $modalInstance, to) {

  $scope.to = to;
  $scope.subject = "";
  $scope.msg = "";

  $scope.getTitle = function () {
    if ($scope.to) {
      return "Send Message To : " + $scope.to;
    } else {
      return "Broadcast To All";
    }
  }

  $scope.send = function () {

    if ($scope.to) {
      $http.post('/api/xmpp/send', {
        to: $scope.to,
        payload: {
          type: "message",
          subject: $scope.subject,
          message: $scope.msg
        }
      }).
        success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $modalInstance.close();
        }).
        error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    } else {
      $http.post('/api/xmpp/broadcast', {
        to: $scope.to,
        payload: {
          type: "message",
          subject: $scope.subject,
          message: $scope.msg
        }
      }).
        success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $modalInstance.close();
        }).
        error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }


  }
});
