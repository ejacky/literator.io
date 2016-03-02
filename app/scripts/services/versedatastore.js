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
      getAuthorByName: getAuthorByName,
      getRandomVerse: getRandomVerse,
      getRandomVerseForAuthor: getRandomVerseForAuthor,
      getVerseByAuthorAndName: getVerseByAuthorAndName
    };


    /**
     * Returns data structure
     * @returns {Promise}
     */
    function getDataStructure() {
      if (!promises.getDataStructure) {
        promises.getDataStructure = $http({
          method: 'GET',
          url: 'resources/verses/structure.json',
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
     * @param {String} authorName
     * @returns {Promise.<VerseAuthor|null>}
     */
    function getAuthorByName(authorName) {
      return getAuthorsList().then(function(authors) {
        var data = _.findWhere(authors, {name: authorName});
        return data ? new VerseAuthor(data) : null;
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

    /**
     * Returns random verse for author passed
     * @param {String} authorName
     * @returns {Promise.<Verse|null>}
     */
    function getRandomVerseForAuthor(authorName) {
      return getVersesList().then(function(verses) {
        var verseData = _.sample(_.where(verses, {authorName: authorName}));
        return verseData ? new Verse(verseData) : null;
      });
    }

    /**
     * Returns specific verse by passed params
     * @param {String} authorName
     * @param {String} verseName
     * @returns {Promise.<Verse|null>}
     */
    function getVerseByAuthorAndName(authorName, verseName) {
      return getVersesList().then(function(verses) {
        var verseData = _.findWhere(verses, {authorName: authorName, name: verseName});
        return verseData ? new Verse(verseData) : null;
      });
    }
  });
