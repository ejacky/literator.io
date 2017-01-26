'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('HeaderCtrl', function ($scope) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $scope.isVisible = false;

      $scope.$on('HeaderCtrl.doShow', show);
      $scope.$on('HeaderCtrl.doHide', hide);
    }

    /**
     * Hides header
     */
    function hide() {
      $scope.isVisible = false;
    }

    /**
     * Shows header
     */
    function show() {
      $scope.isVisible = true;
    }
  });
