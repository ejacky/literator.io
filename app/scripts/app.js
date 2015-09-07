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
    'pascalprecht.translate'
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
;
