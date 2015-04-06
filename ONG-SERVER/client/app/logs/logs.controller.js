'use strict';

angular.module('ongServerApp')
  .controller('LogsCtrl', function ($scope, socket) {
    $scope.logs = [];

    socket.syncUpdates('user', $scope.logs, function(event, item, array){
    	console.log(item);
    	$scope.logs.push(Date.now() + JSON.stringify(item));

    });
  });
