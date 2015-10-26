'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:VerseCtrl
 * @description
 * # VerseCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('VerseCtrl', function ($scope, $interval, VerseDataStore) {

    var versePieces = null;
    var narrativeTimer = null;

    init();

    /**
     * Initializes controller
     */
    function init() {
      // Load random verse
      VerseDataStore.getRandomVerse().then(function(verse){
        // Load all the content of the verse
        return verse.loadContent();
      }).then(function(verse){
        versePieces = verse.getPieces({});

        // Populate scope
        $scope.verse = verse;
        $scope.versePieces = [];

        // Start narrative
        continueNarrative();
      }).catch(function(e){
        console.log(e);
      });
    }

    /**
     * Continues verse output
     */
    function continueNarrative() {
      if (angular.isDefined(narrativeTimer)) {
        $interval.cancel(narrativeTimer);
      }

      narrativeTimer = $interval(displayNextVersePiece, 100);
    }

    /**
     * Stops verse output
     */
    function stopNarrative() {
      if (angular.isDefined(narrativeTimer)) {
        $interval.cancel(narrativeTimer);
        narrativeTimer = null;
      }
    }

    /**
     * Getting next piece of verse and displaying it based on its type
     */
    function displayNextVersePiece() {
      var nextPiece = versePieces.shift();

      // Exit, if no pieces left
      if (!angular.isDefined(nextPiece)) {
        return stopNarrative();
      }

      $scope.versePieces.push(nextPiece);
    }
  });
