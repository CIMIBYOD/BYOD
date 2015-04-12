'use strict';

angular.module('ongServerApp')
  .directive('map', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var winHeight = $window.innerHeight;

        var headerHeight = 100;

        element.css('height', winHeight - headerHeight + 'px');
      }
    };
  });
