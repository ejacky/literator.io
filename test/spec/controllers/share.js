'use strict';

describe('Controller: ShareCtrl', function () {

  // load the controller's module
  beforeEach(module('literatorioApp'));

  var ShareCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShareCtrl = $controller('ShareCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should init', function () {
    expect(scope.shareUrl).toBeDefined();
    expect(scope.shareTitle).toBeDefined();
    expect(scope.shareDescription).toBeDefined();
    expect(scope.shareImage).toBeDefined();
  });
});
