'use strict';

angular.module('ongServerApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    $scope.domain_name = "";
    $scope.xmpp_server = "";
    $scope.xmpp_broadcast_room = "france@conference.cimicop";
    $scope.server_host = "";
    $scope.situation_from = "";
    $scope.situation_to = "";
    $scope.situation_ws = "";
    $scope.location_ws = "";
    $scope.alert_ws = "";
    $scope.situation_sync = 0;

    $http.get('/api/configuration').success(function(config) {
      if(config){
        $scope.domain_name = config.domain_name;
        $scope.xmpp_server = config.xmpp_server;
        $scope.xmpp_broadcast_room = config.xmpp_broadcast_room;
        $scope.server_host = config.server_host;
        $scope.situation_from = config.situation_from;
        $scope.situation_to = config.situation_to;
        $scope.situation_ws = config.situation_ws;
        $scope.location_ws = config.location_ws;
        $scope.alert_ws = config.alert_ws;
        $scope.situation_sync = config.situation_sync;
      }
    });

    //TODO secure this, now anyone can change the configs !
    $scope.update = function() {
      $http.put('/api/configuration', {
        domain_name : $scope.domain_name,
        xmpp_server : $scope.xmpp_server,
        xmpp_broadcast_room : $scope.xmpp_broadcast_room,
        server_host :$scope.server_host,
        situation_from: $scope.situation_from,
        situation_to : $scope.situation_to,
        situation_ws : $scope.situation_ws,
        location_ws : $scope.location_ws,
        alert_ws :$scope.alert_ws,
        situation_sync : $scope.situation_sync
      });
    };

  });
