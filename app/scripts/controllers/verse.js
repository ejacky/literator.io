'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:VerseCtrl
 * @description
 * # VerseCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('VerseCtrl', function ($scope, VerseDataStore) {

    // Load random verse
    VerseDataStore.getRandomVerse().then(function(verse){
      // Load all the content of the verse
      return verse.loadContent();
    }).then(function(verse){
      // Display
      $scope.verse = verse;
    }).catch(function(e){
      console.log(e);
    });
  });
