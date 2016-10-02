'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:ShareCtrl
 * @description
 * # ShareCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('ShareCtrl', function ($scope, Analytics) {
    $scope.shareUrl = window.location.href;
    $scope.shareTitle = ''; // Pass it in onload
    $scope.shareDescription = ''; // Pass it in onload
    $scope.shareImage = window.location.href.replace(/#.*/, '') + 'images/og_image_560x292.jpg'; // Pass it in onload
    
    $scope.onClick = onClick;

    function onClick(snName) {
      Analytics.trackEvent('web', 'share-click', snName);
    }
  });
