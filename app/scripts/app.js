'use strict';

/**
 * @ngdoc overview
 * @name literatorioApp
 * @description
 * # literatorioApp
 *
 * Main module of the application.
 */
angular
  .module('literatorioApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'angular-google-analytics',
    'underscore',
    'angular-speakingurl',
    'webfont-loader'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/verse/404', {
        templateUrl: 'views/verse404.html',
        controller: 'Verse404Ctrl',
        controllerAs: 'verse404'
      })
      .when('/verse/:authorName/:verseName', {
        templateUrl: 'views/verse.html',
        controller: 'VerseCtrl',
        controllerAs: 'verse'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($translateProvider) {
    // Configure lang files location
    $translateProvider.useStaticFilesLoader({
      prefix: '/languages/',
      suffix: '.json'
    });

    // Some security stuff
    $translateProvider.useSanitizeValueStrategy('escape');

    // Setup languages and fallbacks
    var langMap = {
      'en-US': 'en',
      'ru-RU': 'ru',
      '*': 'en'
    };

    $translateProvider
      .registerAvailableLanguageKeys(['en', 'ru'], langMap)
      .fallbackLanguage('en')
      .determinePreferredLanguage()
    ;

    $translateProvider.useLocalStorage();
  })
  .config(function(AnalyticsProvider) {
    // Set analytics account
    AnalyticsProvider.setAccount('UA-6315511-11');

    // Track all routes (or not)
    AnalyticsProvider.trackPages(false);

    // Use display features plugin
    AnalyticsProvider.useDisplayFeatures(true);

    // Use analytics.js instead of ga.js
    AnalyticsProvider.useAnalytics(true);
  })
  .run(function($rootScope, $window, $location, $translate, Analytics) {
    // Track pageview
    $rootScope.$on('$routeChangeSuccess',
      function() {
        Analytics.trackPage($location.path());
      });

    // Watch for language change
    $rootScope.$on('$translateChangeEnd',
      function() {
        $rootScope.currentLang = $translate.proposedLanguage() || $translate.use();
      });

    // Load custom fonts
    $window.WebFont.load({
      custom: {
        families: ['NotoSerif:n4,i4,n7']
      }
    });
  })
;
