'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.SoundManager
 * @description
 * # SoundManager
 * Service to manage and play different sounds of the app.
 */
angular.module('literatorioApp')
  .service('SoundManager', function ($injector) {
    var SoundService = null;

    // Init SoundService
    try {
      SoundService = $injector.get('SoundService');

      // Load sounds
      SoundService.loadSound({
        name: 'bell',
        src: 'resources/sounds/bell.mp3'
      });
    } catch (e) {
      // SoundService throws error on construction, if WebAudio not supported. Lead to failures in unit tests (PhantomJS)
    }

    // Public API
    return {
      playSound: playSound
    };

    /**
     * Plays sound with name passed.
     * @param name
     */
    function playSound(name) {
      SoundService.getSound(name).start();
    }
  });
