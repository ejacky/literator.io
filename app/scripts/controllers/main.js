'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('MainCtrl', function ($rootScope, $scope, $location, $timeout, $translate, VerseDataStore, 
                                    CountriesDataStore, Analytics) {

    var otherTimers = [];
    
    init();


    /**
     * Initializes controller
     */
    function init() {
      var currentCountry = CountriesDataStore.getCurrentCountry();
      
      // Set page title
      $translate('COMMON_APP_NAME').then(function(translation) {
        $rootScope.global.pageTitle = translation;
      });

      // Populate scope
      $scope.isCatalogEnabled = currentCountry ? currentCountry.isCatalogEnabled : false;
      $scope.isLeaving = false;
      $scope.onStartButtonClick = onStartButtonClick;

      // Add event listeners
      $scope.$on('CountriesDataStore.countryChange', onCountryChange);
      $scope.$on('$destroy', onDestroy);

      // Show header and footer
      otherTimers.push($timeout(function(){
        $rootScope.$broadcast('HeaderCtrl.doShow');
        $rootScope.$broadcast('FooterCtrl.doShow');
        $rootScope.$broadcast('GitHubRibbonCtrl.doShow');
      }, 3000)); // sync with animation
      
      Analytics.trackEvent('web', 'main-init');
    }

    /**
     * Callback firing on start button click
     */
    function onStartButtonClick() {
      VerseDataStore.getRandomVerse().then(function(verse) {
        leavePageWithNewUrl(verse.url);

        Analytics.trackEvent('web', 'main-start-btn-click');
      });
    }

    /**
     * Leaves the page and redirects to URL passed
     * @param {String} url
     */
    function leavePageWithNewUrl(url) {
      $scope.isLeaving = true;

      $timeout(function(){
        $location.url(url);
      }, 1500); // sync with animation

      $rootScope.$broadcast('HeaderCtrl.doHide');
      $rootScope.$broadcast('FooterCtrl.doHide');
      $rootScope.$broadcast('GitHubRibbonCtrl.doHide');
    }

    /**
     * Callback firing on country change
     * @param event
     * @param data
     */
    function onCountryChange(event, data) {
      $scope.isCatalogEnabled = data.country.isCatalogEnabled;
    }

    /**
     * Callback firing on scope/controller destruction
     */
    function onDestroy() {
      // Stop timers to prevent memory leaks
      otherTimers.forEach(function(timer) {
        $timeout.cancel(timer);
      });
    }
  });
