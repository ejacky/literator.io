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
      }
    };

    return Verse;
  });
