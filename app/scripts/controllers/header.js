'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('HeaderCtrl', function ($rootScope) {

    var $ = angular.element;
    var headerElement = $('#header');

    init();


    /**
     * Initializes controller
     */
    function init() {
      $rootScope.$on('HeaderCtrl.doShow', show);
      $rootScope.$on('HeaderCtrl.doHide', hide);
    }

    /**
     * Hides footer
     */
    function hide() {
      headerElement.removeClass('show');
    }

    /**
     * Shows footer
     */
    function show() {
      headerElement.addClass('show');
    }
  });
