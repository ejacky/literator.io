'use strict';

describe('Controller: Verse404Ctrl', function () {

  // load the controller's module
  beforeEach(module('literatorioApp'));

  var Verse404Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Verse404Ctrl = $controller('Verse404Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should be loadable', function () {
    expect(!!Verse404Ctrl).toBe(true);
  });
});
