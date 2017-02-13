'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:SupportCtrl
 * @description
 * # SupportCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('SupportCtrl', function ($rootScope, Analytics, $translate, $scope) {
    var $ = angular.element;

    init();


    /**
     * Initializes controller
     */
    function init() {
      $rootScope.global.pageTitle = $translate.instant('COMMON_APP_NAME');

      $scope.onPaypalClick = onPaypalClick;

      $('html, body').animate({scrollTop: 0});

      $rootScope.$broadcast('HeaderCtrl.doShow');
      $rootScope.$broadcast('FooterCtrl.doShow');
      $rootScope.$broadcast('GitHubRibbonCtrl.doHide');

      Analytics.trackEvent('web', 'support-init');
    }

    function onPaypalClick() {
      Analytics.trackEvent('web', 'support-donate-click', 'paypal');
    }
  });
