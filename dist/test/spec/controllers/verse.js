'use strict';

describe('Controller: VerseCtrl', function () {

  // load the controller's module
  beforeEach(module('literatorioApp'));

  var VerseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VerseCtrl = $controller('VerseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should be loadable', function () {
    expect(!!VerseCtrl).toBe(true);
  });
});
