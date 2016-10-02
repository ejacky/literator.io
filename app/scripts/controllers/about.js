'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('AboutCtrl', function ($rootScope, $translate, Analytics) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $rootScope.global.pageTitle = $translate.instant('COMMON_APP_NAME');

      $rootScope.$broadcast('HeaderCtrl.doShow');
      $rootScope.$broadcast('FooterCtrl.doShow');
      $rootScope.$broadcast('GitHubRibbonCtrl.doHide');

      Analytics.trackEvent('web', 'about-init');
    }
  });
