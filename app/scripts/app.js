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
    'webfont-loader',
    'mcwebb.sound'
  ])
  .filter('encodeURIComponent', function($window) {
    return $window.encodeURIComponent;
  })
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
      .when('/catalog', {
        templateUrl: 'views/catalog.html',
        controller: 'CatalogCtrl',
        controllerAs: 'catalog'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($translateProvider) {
    // Configure lang files location
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/',
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
  .run(function($rootScope, $injector, $window, $location, $translate, Analytics) {
    // Add global scope vars
    $rootScope.global = {};
    $rootScope.global.pageTitle = 'Literator.io'; // to solve possible translation glitch

    // Track pageview
    $rootScope.$on('$routeChangeSuccess', function(event, currentRoute) {
      $rootScope.global.currentPage = currentRoute.$$route.controllerAs;

      Analytics.trackPage($location.path());
    });

    // Load custom fonts
    $window.WebFont.load({
      custom: {
        families: ['NotoSerif:n4,i4,n7']
      }
    });

    // Load sounds
    try {
      var SoundService = $injector.get('CountriesDataStore');
      SoundService.loadSound({
        name: 'bell',
        src: 'resources/sounds/bell.mp3'
      });
    } catch (e) {

    }

    // Need to manually init CountriesDataStore to determine country
    $injector.get('CountriesDataStore'); // $injector needed because of $rootScope.global
  })
;
