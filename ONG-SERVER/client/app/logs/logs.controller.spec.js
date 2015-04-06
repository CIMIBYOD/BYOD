'use strict';

describe('Controller: LogsCtrl', function () {

  // load the controller's module
  beforeEach(module('ongServerApp'));

  var LogsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LogsCtrl = $controller('LogsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
