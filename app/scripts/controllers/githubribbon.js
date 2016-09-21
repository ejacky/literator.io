'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:GitHubRibbonCtrl
 * @description
 * # GitHubRibbonCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('GitHubRibbonCtrl', function ($scope) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $scope.isVisible = false;

      $scope.$on('GitHubRibbonCtrl.doShow', show);
      $scope.$on('GitHubRibbonCtrl.doHide', hide);
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
