'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('MainCtrl', function ($rootScope, $scope, $location, $translate, VerseDataStore) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $rootScope.pageTitle = $translate.instant('COMMON_APP_NAME');

      // Populate scope
      $scope.onStartButtonClick = onStartButtonClick;
    }

    /**
     * Callback firing on start button click
     */
    function onStartButtonClick() {
      VerseDataStore.getRandomVerse().then(function(verse) {
        $location.url(verse.url);
      });
    }
  });
