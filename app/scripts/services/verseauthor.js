'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.VerseAuthor
 * @description
 * # VerseAuthor
 * Model to store verse's author data
 */
angular.module('literatorioApp')
  .service('VerseAuthor', function () {

    // Constructor
    function VerseAuthor(rawData) {
      angular.extend(this, rawData);
    }

    return VerseAuthor;
  });
