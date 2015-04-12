'use strict';

angular.module('ongServerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('situation', {
        url: '/situation',
        templateUrl: 'app/situation/situation.html',
        controller: 'SituationCtrl'
      });
  });