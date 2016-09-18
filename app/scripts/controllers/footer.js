'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('FooterCtrl', function ($scope, $rootScope) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $scope.isVisible = false;

      $rootScope.$on('FooterCtrl.doShow', show);
      $rootScope.$on('FooterCtrl.doHide', hide);
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
