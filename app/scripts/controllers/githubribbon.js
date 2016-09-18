'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:GitHubRibbonCtrl
 * @description
 * # GitHubRibbonCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('GitHubRibbonCtrl', function ($scope, $rootScope) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $scope.isVisible = false;

      $rootScope.$on('GitHubRibbonCtrl.doShow', show);
      $rootScope.$on('GitHubRibbonCtrl.doHide', hide);
    }

    /**
     * Hides view
     */
    function hide() {
      $scope.isVisible = false;
    }

    /**
     * Shows view
     */
    function show() {
      $scope.isVisible = true;
    }
  });
