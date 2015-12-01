'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.VerseBlock
 * @description
 * # VerseBlock
 * Represents block of characters in verse.
 */
angular.module('literatorioApp')
  .service('VerseBlock', function ($speakingurl) {

    // Constructor
    function VerseBlock(string) {
      this._string = string;
      this._stringNormalized = this.normalizeString(string);
    }

    // Define prototype
    VerseBlock.prototype = {
      /**
       * Returns TRUE, if passed text matches the given text in this VerseBlock
       * @param {String} str
       * @param {Number} length
       * @returns {boolean}
       */
      match: function(str, length) {
        if (str.length < Math.min(this._string.length, length)) {
          return false;
        }

        return this._stringNormalized.indexOf(this.normalizeString(str.substr(0, length))) === 0;
      },

      /**
       * Returns normalized string, useful for text matches we need
       * @param {String} str
       * @returns {String}
       */
      normalizeString: function(str) {
        str = (str + '')
          .toLowerCase() // get low
          .replace('ё', 'е') // special Russian conversion
        ;

        return $speakingurl.getSlug(str);
      },

      toString: function() {
        return this._string;
      },

      valueOf: function() {
        return this.toString();
      }
    };

    return VerseBlock;
  });
