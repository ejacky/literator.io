'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('FooterCtrl', function ($rootScope) {

    var $ = angular.element;
    var footerElement = $('#footer');

    init();


    /**
     * Initializes controller
     */
    function init() {
      $rootScope.$on('FooterCtrl.doShow', show);
      $rootScope.$on('FooterCtrl.doHide', hide);
    }

    /**
     * Hides footer
     */
    function hide() {
      footerElement.removeClass('show');
    }

    /**
     * Shows footer
     */
    function show() {
      footerElement.addClass('show');
    }
  });
