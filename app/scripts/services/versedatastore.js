'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.VerseDataStore
 * @description
 * # VerseDataStore
 * Datastore to retrieve and manipulate all verses existed in system
 */
angular.module('literatorioApp')
  .factory('VerseDataStore', function ($q, $http, _, Verse, VerseAuthor) {
    var promises = {};

    // Pre-load data structure
    getDataStructure();

    // Public API
    return {
      getDataStructure: getDataStructure,
      getAuthorById: getAuthorById,
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
     * Returns list of all verses available (raw data)
     * @returns {Promise.<Array>}
     */
    function getVersesList() {
      return getDataStructure().then(function(data) {
        return data.verses;
      });
    }

    /**
     * Returns list of all authors available (raw data)
     * @returns {Promise.<Array>}
     */
    function getAuthorsList() {
      return getDataStructure().then(function(data) {
        return data.authors;
      });
    }

    /**
     * Returns author by ID passed
     * @param {String} authorId
     * @returns {Promise.<VerseAuthor|null>}
     */
    function getAuthorById(authorId) {
      return getAuthorsList().then(function(authors) {
        return authors[authorId] ? new VerseAuthor(authors[authorId]) : null;
      });
    }

    /**
     * Returns random verse
     * @returns {Promise.<Verse|null>}
     */
    function getRandomVerse() {
      return getVersesList().then(function(verses) {
        return verses && verses.length ? new Verse(_.sample(verses)) : null;
      });
    }
  });
