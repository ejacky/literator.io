'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('MainCtrl', function ($scope, $location, VerseDataStore) {

    init();


    /**
     * Initializes controller
     */
    function init() {
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
