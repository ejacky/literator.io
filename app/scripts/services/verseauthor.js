'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.VerseAuthor
 * @description
 * # VerseAuthor
 * Model to store verse's author data
 */
angular.module('literatorioApp')
  .factory('VerseAuthor', function ($injector) {

    // Constructor
    function VerseAuthor(rawData) {
      angular.extend(this, {
        verses: [], // call getVerses to fill it
      }, rawData);
    }

    // Define prototype
    VerseAuthor.prototype = {
      /**
       * Loads up async content
       * @returns {Promise.<VerseAuthor>}
       */
      getVerses: function () {
        var self = this;

        return $injector.get('VerseDataStore').getVersesForAuthor(self.name).then(function(data) {
          self.verses = data;
        });
      }
    };

    return VerseAuthor;
  });
