'use strict';

angular.module('ongServerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logs', {
        url: '/logs',
        templateUrl: 'app/logs/logs.html',
        controller: 'LogsCtrl'
      });
  });