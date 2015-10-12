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
    'underscore'
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
      .when('/verse', {
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

    $translateProvider.preferredLanguage('ru-RU');

    //$translateProvider.useLocalStorage();
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
  .run(function($rootScope, $location, Analytics) {
    // Track pageview
    $rootScope.$on('$routeChangeSuccess',
      function() {
        Analytics.trackPage($location.path());
      });
  })
;
