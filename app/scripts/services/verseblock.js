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
    }

    // Define prototype
    VerseBlock.prototype = {
      toString: function(){
        return this._string;
      },

      valueOf: function(){
        return this.toString();
      }
    };

    return VerseBlock;
  });
