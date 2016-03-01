'use strict';

describe('Controller: FooterCtrl', function () {

  // load the controller's module
  beforeEach(module('literatorioApp'));

  var FooterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FooterCtrl = $controller('FooterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should be loadable', function () {
    expect(!!FooterCtrl).toBe(true);
  });
});
