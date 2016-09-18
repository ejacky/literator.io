'use strict';

describe('Controller: GitHubRibbonCtrl', function () {

  // load the controller's module
  beforeEach(module('literatorioApp'));

  var GithubribbonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GithubribbonCtrl = $controller('GitHubRibbonCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should be loadable', function () {
    expect(!!GithubribbonCtrl).toBe(true);
  });
});
