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
    var soundService = null;

    // Init SoundService
    try {
      soundService = $injector.get('SoundService');

      // Load sounds
      soundService.loadSound({
        name: 'bell',
        src: 'resources/sounds/bell.mp3'
      });
    } catch (e) {
      // SoundService throws error on construction, if WebAudio not supported. Lead to failures in unit tests (PhantomJS)
      console.warn('[SoundManager] WebAudio is not supported');
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
      if (!soundService) {
        return;
      }
      
      soundService.getSound(name).start();
    }
  });
