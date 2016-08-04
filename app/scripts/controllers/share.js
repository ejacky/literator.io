'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:ShareCtrl
 * @description
 * # ShareCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('ShareCtrl', function ($scope) {
    $scope.shareUrl = window.location.href;
    $scope.shareTitle = ''; // Pass it in onload
    $scope.shareDescription = ''; // Pass it in onload
    $scope.shareImage = ''; //window.location.href.replace(/#.*/, '') + 'images/apple-touch-icon-precomposed.png'; // Pass it in onload
  });
