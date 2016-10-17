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
      getAuthorsList: getAuthorsList,
      getAuthorByName: getAuthorByName,
      getRandomVerse: getRandomVerse,
      getRandomVerseForAuthor: getRandomVerseForAuthor,
      getVerseByAuthorAndName: getVerseByAuthorAndName
    };


    /**
     * Returns data structure (raw data)
     * @returns {Promise<Object>}
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
     * Returns list of all authors available
     * @param {String} [countryCode]
     * @returns {Promise.<Array<VerseAuthor>>}
     */
    function getAuthorsList(countryCode) {
      return getDataStructure().then(function(data) {
        return data.authors.filter(function(item) {
          return !countryCode || !item.studiedInCountries || item.studiedInCountries.indexOf(countryCode) !== -1;
        }).map(function(data) {
          return new VerseAuthor(data);
        });
      });
    }

    /**
     * Returns author by ID passed
     * @param {String} authorName
     * @returns {Promise.<VerseAuthor|null>}
     */
    function getAuthorByName(authorName) {
      return getDataStructure().then(function(data) {
        var author = _.findWhere(data.authors, {name: authorName});
        return author ? new VerseAuthor(author) : null;
      });
    }

    /**
     * Returns random verse
     * @returns {Promise.<Verse|null>}
     */
    function getRandomVerse(countryCode) {
      if (countryCode) {
        var authorNames;

        return getAuthorsList(countryCode).then(function(authors) {
          // Get only names
          authorNames = authors.map(function(author) {
            return author.name;
          });

          return getDataStructure();
        }).then(function(data) {
          // Get only verses of authorNames
          var verses = data.verses.filter(function(verse) {
            return authorNames.indexOf(verse.authorName) !== -1;
          });

          return verses && verses.length ? new Verse(_.sample(verses)) : null;
        });
      } else {
        return getDataStructure().then(function(data) {
          return data.verses && data.verses.length ? new Verse(_.sample(data.verses)) : null;
        });
      }
    }

    /**
     * Returns random verse for author passed
     * @param {String} authorName
     * @returns {Promise.<Verse|null>}
     */
    function getRandomVerseForAuthor(authorName) {
      return getDataStructure().then(function(data) {
        var verseData = _.sample(_.where(data.verses, {authorName: authorName}));
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
      return getDataStructure().then(function(data) {
        var verseData = _.findWhere(data.verses, {authorName: authorName, name: verseName});
        return verseData ? new Verse(verseData) : null;
      });
    }
  });
