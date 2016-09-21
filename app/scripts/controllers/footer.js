'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('FooterCtrl', function ($scope) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $scope.isVisible = false;

      $scope.$on('FooterCtrl.doShow', show);
      $scope.$on('FooterCtrl.doHide', hide);
    }

    /**
     * Hides footer
     */
    function hide() {
      $scope.isVisible = false;
    }

    /**
     * Shows footer
     */
    function show() {
      $scope.isVisible = true;
    }
  });
