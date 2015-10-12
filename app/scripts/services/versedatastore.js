'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.VerseDataStore
 * @description
 * # VerseDataStore
 * Datastore to retrieve and manipulate all verses existed in system
 */
angular.module('literatorioApp')
  .factory('VerseDataStore', function ($q, $http, _, Verse) {
    var promises = {};

    // Pre-load data structure
    getDataStructure();

    // Public API
    return {
      getDataStructure: getDataStructure,
      getRandomVerse: getRandomVerse
    };


    /**
     * Returns data structure
     * @returns {Promise}
     */
    function getDataStructure() {
      if (!promises.getDataStructure) {
        promises.getDataStructure = $http({
          method: 'GET',
          url: '/resources/verses/structure.json',
          responseType: 'json'
        }).then(function(response) {
          return response.data;
        });
      }

      return promises.getDataStructure;
    }

    /**
     * Returns list of all verses available
     * @returns {Promise.<Array>}
     */
    function getVersesList() {
      return getDataStructure().then(function(data){
        return data.verses;
      });
    }

    /**
     * Returns random verse
     * @returns {Promise.<Verse|null>}
     */
    function getRandomVerse() {
      return getVersesList().then(function(verses){
        return verses && verses.length ? new Verse(_.sample(verses)) : null;
      });
    }
  });
