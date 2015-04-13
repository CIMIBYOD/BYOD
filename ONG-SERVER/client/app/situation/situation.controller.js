'use strict';

angular.module('ongServerApp')
  .controller('SituationCtrl', function ($scope, $http, $modal, User, Auth, socket, leafletData) {

    /*************************************/
    /********   Configuration    ********/
    /**************************************/
    var config={
      debug:true,
      //which src to choose for map server (see below)
      mapSrc:"afghaTiled",
      //which report url to choose to create reports (see below)
      reportUrl:"demo",
      map :{
        france:{
          location: new L.LatLng(48.85, 2.4),
          zoomLevel : 10
        },
        //untiled afghanistan map
        afgha:{
          location: new L.LatLng(34.59, 69.8),
          mapUrl:'http://192.168.1.130/arcgis/rest/services/SWContest/Afghanistan/MapServer',
          zoomLevel : 12
        },
        //tiled afghanistan map
        afghaTiled:{
          location: new L.LatLng(34.59, 69.8),
          mapUrl:'http://192.168.1.102/arcgis/services/Contestreduit/MapServer/WMSServer',
          layers:'0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33',
          zoomLevel : 12
        }
      }
    };

    $scope.current_situation = undefined;

    $scope.users = User.query();
    $scope.users.$promise.then(function() {
      $scope.initUsersMarkers();

      $http.get('/api/situation').success(function(situation) {
        if(situation){
          $scope.current_situation = situation;
        }
      });
    });

    $scope.local_icons = {
      default_icon: {
      },
      user_green_icon: {
        iconUrl: 'assets/icon/USER_available.png',
        iconSize: [42, 42]
      },
      user_green_gray: {
        iconUrl: 'assets/icon/ic_action_user_gray.png',
        iconSize: [42, 42]
      },
      user_green_red: {
        iconUrl: 'assets/icon/ic_action_user_red.png',
        iconSize: [42, 42]
      }
    };

    $scope.usersMarkers = {};

    $('#map').on('click', '.trigger', function(event) {
      console.log(event.target.id);
      $scope.broadcastMessage(event.target.id);
    });

    socket.syncUpdates('user', $scope.users, function(event, item, array){

      var user = item;
      if(event === "updated"){
        $scope.usersMarkers[user._id] = {
          lat: user.last_known_position.latitude,
          lng: user.last_known_position.longitude,
          message: user.email + "<button id=\""+user.email+"\" class=\"btn btn-default trigger\"><span class=\"glyphicon glyphicon-comment\"></span> Send Message</button>",
          icon:  $scope.local_icons.user_green_icon
        }
      }
    });

    $scope.initUsersMarkers = function(){

      for(var i=0; i<$scope.users.length; i++){
        var user = $scope.users[i];
        if(user.last_known_position !== undefined) {
          console.log(user.last_known_position);
          $scope.usersMarkers[user._id] = {
            lat: user.last_known_position.latitude,
            lng: user.last_known_position.longitude,
            message: user.email + "<button id=\""+user.email+"\" class=\"btn btn-default trigger\"><span class=\"glyphicon glyphicon-comment\"></span> Send Message</button>",
            icon: $scope.local_icons.user_green_icon
          }
        }
      }
      leafletData.getMap().then(function(map) {
        if (config.mapSrc == 'afghaTiled') {
          map.setView(config.map.afghaTiled.location,  config.map.afghaTiled.zoomLevel);
          L.tileLayer.wms(config.map.afghaTiled.mapUrl, {
            layers: config.map.afghaTiled.layers
          }).addTo(map);
        }
      });
    };

    socket.syncUpdates('situation', undefined, function(event, item, array){
      console.log(item);
      //$scope.logs.push(Date.now() + JSON.stringify(item));

      $scope.current_situation = item.situation;
      leafletData.getMap().then(function(map) {
        for(var i=0 ;i<$scope.current_situation.entities.length; i++){
          var bso = $scope.current_situation.entities[i];
          removeBso(bso.id, map);
          _addBso(bso, map);
        }
      });
    });




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

      var normalizeKey = function(key){
        return "$"+key.replace(/\W/g, '_');
      }
      return Cache;
    })();
    $scope.cache = new Cache();



    $scope.user = Auth.getCurrentUser();

    $scope.refresh = function(){
      console.log("refresh" + $scope.user.email +" "+ $scope.user.password);
      $http.post('/api/situation', { email:  $scope.user.email , password:  $scope.user.password})
        .success(function(situation) {
          if(situation){
            $scope.current_situation = situation;
            console.log($scope.current_situation);
            leafletData.getMap().then(function(map) {
              for(var i=0 ;i<$scope.current_situation.entities.length; i++){
                _addBso($scope.current_situation.entities[i], map);
                //var layer = _bindPopup(_addBso($scope.current_situation.entities[i]), $scope.current_situation.entities[i]);
                //layer.addTo(map);
                console.log("Add ");
                console.log($scope.current_situation.entities[i]);
              }
            });
          }else{
            console.log("no situation");
          }
        }).error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(status +" "+ data);
        });
    };

    //$scope.refresh();

    $scope.broadcastMessage = function(toValue){
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
    var removeBso = function(id, map){

      if(id) {
        var layer = $scope.cache.remove(id);
        if (layer) {
          map.removeLayer(layer);
        }
      }
    }

    /**********     updateBso     *********/

    //update bso from map
    var updateBso = function(bsoJson){

      var bso = JSON.parse(bsoJson);
      //remove and create a new one
      removeBso(bso.id);
      addBso(bsoJson);
    }

    var _addBso = function(bso, map) {
      var layer;
      if (bso.type == "event") {

        layer = _toMarker(bso);
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


    var _toPolygon = function(bso){
      try{
        var edges=[];
        for (var i=0;i<bso.shape.coords.length;i++){
          if(bso.shape.coords[i] !== null){
            edges.push(L.latLng(bso.shape.coords[i].lat, bso.shape.coords[i].lon));
          }
        }
        var color;
        if(bso.subtype =='danger'){color = "#ff0000";}
        else if(bso.subtype =='warning'){color = "#FF8100";}
        else if(bso.subtype =='safe'){color = "#00b35a";}
        else{color = "#ff0000";}
        return _bindPopup(L.polygon(edges,{weight:1,color:color}),bso);

      }catch(reason){
        _log("ERROR: unable to transform area to polygone with reason :" +reason);
      }
    };

    //add popup info to bso
    var _bindPopup = function(layer,bso){
      try{
        console.log("bso.datetime is " + typeof(bso.datetime));
        var validity = new Date(parseInt(bso.datetime)).toDateString();
        return layer.bindPopup("<h5><b>"+bso.name+"</b></h5><br>"+"<b>report date : "+validity+"</b><br>"+bso.description);
      }catch(e){/*TODO*/}
    };

    var _toMarker = function(bso){
      try{
        return _bindPopup(L.marker(L.latLng(bso.shape.coords[0].lat, bso.shape.coords[0].lon), {icon: markerIcons[bso.subtype]}),bso);
      }catch(reason){
        _log("ERROR: unable to transform ponctual to Marker with reason :" +reason);
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
      iconSize:     [32, 32]
    });
    markerIcons["armed-group"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/death-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["death"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/injured-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["injured"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/kidnap-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["kidnap"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/other-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["assets/other"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/riot-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["riot"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/tank-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["tank"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/bomb-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["bomb"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/aircraft-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["aircraft"]=icon;

    icon = L.icon({
      iconUrl: 'assets/icon/helico-marker.png',
      popupAnchor: [1, -16],
      iconSize:     [32, 32]
    });
    markerIcons["helico"]=icon;

  });


angular.module('ongServerApp').controller('ModalInstanceCtrl', function ($scope, $http, $modalInstance, to) {

  $scope.to = to;
  $scope.subject = "";
  $scope.msg = "";

  $scope.getTitle = function(){
      if($scope.to){
        return "Send Message To : " + $scope.to;
      }else{
        return "Broadcast To All";
      }
  }

  $scope.send = function () {

    if($scope.to){
      return "Send Message To : " + $scope.to;
      $http.post('/api/xmpp/send', {
        payload : {
          type: "message",
          subject: $scope.subject,
          msg: $scope.msg
        }
      }).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }else{
      $http.post('/api/xmpp/broadcast', {
        to : $scope.to,
        payload : {
          type: "message",
          subject: $scope.subject,
          msg: $scope.msg
        }
      }).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }


  };
});
