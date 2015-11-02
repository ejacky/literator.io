'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.VerseBlock
 * @description
 * # VerseBlock
 * Represents block of characters in verse.
 */
angular.module('literatorioApp')
  .service('VerseBlock', function () {

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
        return this._stringNormalized.substr(0, length) === this.normalizeString(str).substr(0, length);
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

        return str;
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
