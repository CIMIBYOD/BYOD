'use strict';

angular.module('ongServerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('userslist', {
        url: '/userslist',
        templateUrl: 'app/userslist/userslist.html',
        controller: 'UserslistCtrl'
      });
  });