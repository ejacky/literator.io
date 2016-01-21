'use strict';

describe('Controller: CountryMenuCtrl', function () {

  // load the controller's module
  beforeEach(module('literatorioApp'));

  var CountryMenuCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CountryMenuCtrl = $controller('CountryMenuCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should be loadable', function () {
    expect(!!CountryMenuCtrl).toBe(true);
  });
});
