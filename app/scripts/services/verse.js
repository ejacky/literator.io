'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.Verse
 * @description
 * # Verse
 * Model to store and manipulate verse data.
 */
angular.module('literatorioApp')
  .factory('Verse', function ($http) {

    // Constructor
    function Verse(rawData) {
      angular.extend(this, rawData);
    }

    // Define prototype
    Verse.prototype = {
      DIFFICULTY_EASY: 'easy',
      DIFFICULTY_NORMAL: 'normal',

      _blockStartChar: '{',
      _blockEndChar: '}',

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
          self.content = response.data;
          return self;
        });
      },

      getPieces: function(options) {
        var self = this;

        options = angular.extend({
          difficulty: 'normal',
        }, options);

        self.content = self.normalizeStringToDifficulty(self.content, options.difficulty);
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
            case self._blockStartChar:
              startCharPositions.push(index);
              break;

            case self._blockEndChar:
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
