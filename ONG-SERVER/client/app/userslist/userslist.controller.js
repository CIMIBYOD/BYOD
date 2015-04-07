'use strict';

angular.module('ongServerApp')
  .controller('UserslistCtrl', function ($scope, $http, Auth, User, socket) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();


    socket.syncUpdates('user', $scope.users, function(event, item, array){
      //console.log(item);
      //$scope.logs.push(Date.now() + JSON.stringify(item));

    });

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.revoke = function(user) {
      console.log(user);
      User.revoke({ id: user._id }, {},
        function(user) {
          console.log(user);
      }, function(err) {
        console.log(err);
      });
    };

    $scope.errors = {};
    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .catch( function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

    $scope.convertTimeStamp = function(timestamp){
      var newDate = new Date();
      newDate.setTime(timestamp*1000);
      return newDate.toUTCString();
    }

  });
