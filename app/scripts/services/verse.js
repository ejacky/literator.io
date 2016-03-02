'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.Verse
 * @description
 * # Verse
 * Model to store and manipulate verse data.
 */
angular.module('literatorioApp')
  .factory('Verse', function ($injector, $http, VerseBlock) {

    // Constructor
    function Verse(rawData) {
      angular.extend(this, rawData);

      this.path = [this.PATH_BASE, this.authorName, 'verses', this.name].join('/');
      this.url = [this.URL_BASE, this.authorName, this.name].join('/');
    }

    // Define prototype
    Verse.prototype = {
      DIFFICULTY_EASY: 'easy',
      DIFFICULTY_NORMAL: 'normal',

      BLOCK_SEPARATOR_START: '{',
      BLOCK_SEPARATOR_END: '}',

      URL_BASE: '/verse',
      PATH_BASE: 'resources/verses',

      /**
       * Loads up verse's content
       * @returns {Promise.<Verse>}
       */
      loadContent: function () {
        var self = this;

        return $http({
          method: 'GET',
          url: this.path + '/content.txt'
        }).then(function(response){
          var content = response.data.trim();

          // Post-process received content
          content = content
            .replace(/[\s](\x2d|\x2212|\x2010\x2012\x2043)/g, ' —') // some typography
            .replace(/\n\r|\r\n|\r/g, '\n').replace(/[\n]{3,}/g, '\n\n') // remove non-Unix line breaks
            .replace(/[\x20]{2,}/g, ' ') // remove double spaces
          ;

          self.content = content;
          self.plainText = content.replace(new RegExp('\\' + self.BLOCK_SEPARATOR_START + '|\\' + self.BLOCK_SEPARATOR_END, 'g'), '');
          return self;
        });
      },

      /**
       * Returns content divided into pieces to display it later
       * @param options
       * @returns {Array}
       */
      getPieces: function(options) {
        var self = this;

        options = angular.extend({
          difficulty: 'easy',
        }, options);

        // Get normalized content
        var contentArray = self.normalizeStringToDifficulty(self.content, options.difficulty).split('');

        // Divide into pieces
        var pieces = [];
        var isInBlock = false;
        var blockPiece = null;
        contentArray.forEach(function(char){
          switch (char) {
            case self.BLOCK_SEPARATOR_START:
              isInBlock = true;
              blockPiece = '';
              break;

            case self.BLOCK_SEPARATOR_END:
              isInBlock = false;
              if (blockPiece.length) {
                pieces.push(new VerseBlock(blockPiece));
              }
              break;

            default:
              if (isInBlock) {
                blockPiece += char;
              } else {
                pieces.push(char);
              }
          }
        });

        return pieces;
      },

      /**
       * Returns author of the verse
       * @returns {Object}
       */
      getAuthor: function() {
        return $injector.get('VerseDataStore').getAuthorByName(this.authorName);
      },

      /**
       * Returns TRUE if passed verse matches current verse
       * @param {Verse} verse
       * @returns {Boolean}
       */
      isMatch: function(verse) {
        return this.name === verse.name && this.authorName === verse.authorName;
      },

      /**
       * Returns string, which normalized to passed difficulty (removes other difficulties' markup)
       * @param {String} string
       * @param {String} difficulty
       * @returns {String}
       */
      normalizeStringToDifficulty: function(string, difficulty) {
        var self = this;

        // Convert difficulty string into int of complexity
        var complexity = difficulty === self.DIFFICULTY_EASY ? 1 : 2;

        // Normalize verse content to passed difficulty by removing block separators for other difficulties
        // (if somebody know easier solution, drop me pull request :)
        var contentArray = string.split('');
        var startCharPositions = [];
        var endCharPositions = [];
        contentArray.forEach(function(char, index){
          // Count separators
          switch (char) {
            case self.BLOCK_SEPARATOR_START:
              startCharPositions.push(index);
              break;

            case self.BLOCK_SEPARATOR_END:
              endCharPositions.push(index);
              break;
          }

          // Check, if we counted all separators for one block (Note: current algo not work with mixed groups)
          if (startCharPositions.length && startCharPositions.length === endCharPositions.length) {
            var blockComplexity = Math.min(startCharPositions.length, complexity); // if block has lower complexity, use its maximum
            var cleanup = function(position, index) {
              if (index + 1 !== blockComplexity) {
                delete contentArray[position];
              }
            };

            // Cleanup unnecessary blocks' separators
            startCharPositions.reverse().forEach(cleanup);
            endCharPositions.forEach(cleanup);

            // Reset stored positions
            startCharPositions = [];
            endCharPositions = [];
          }
        });

        return contentArray.join('');
      }
    };

    return Verse;
  });
