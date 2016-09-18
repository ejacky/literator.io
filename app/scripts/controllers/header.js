'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('HeaderCtrl', function ($scope, $rootScope) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $scope.isVisible = false;

      $rootScope.$on('HeaderCtrl.doShow', show);
      $rootScope.$on('HeaderCtrl.doHide', hide);
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
