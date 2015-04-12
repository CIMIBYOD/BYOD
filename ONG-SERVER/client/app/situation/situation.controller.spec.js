'use strict';

describe('Controller: SituationCtrl', function () {

  // load the controller's module
  beforeEach(module('ongServerApp'));

  var SituationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SituationCtrl = $controller('SituationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
