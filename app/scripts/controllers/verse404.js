'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:Verse404Ctrl
 * @description
 * # Verse404Ctrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('Verse404Ctrl', function (Analytics, $rootScope) {
    Analytics.trackEvent('web', 'verse404-init');

    $rootScope.$broadcast('HeaderCtrl.doShow');
    $rootScope.$broadcast('FooterCtrl.doShow');
  });
