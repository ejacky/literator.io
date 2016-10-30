'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:CatalogCtrl
 * @description
 * # CatalogCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('CatalogCtrl', function ($rootScope, $scope, $timeout, $location, $translate, VerseDataStore, CountriesDataStore, Analytics) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      Analytics.trackEvent('web', 'catalog-init');
      
      $rootScope.global.pageTitle = $translate.instant('VIEW_CATALOG_TITLE') + ' | ' + $translate.instant('COMMON_APP_NAME');

      // Load data
      VerseDataStore.getAuthorsList(CountriesDataStore.getCurrentCountry().countryCode)
        .then(function(authors) {
          $scope.authors = authors;
          
          // Load verses for each author
          authors.forEach(function(author) {
            author.getVerses(); // this will fill verses property of the object
          });
        })
      ;

      $scope.authorsFilter = authorsFilter;
      $scope.onVerseLinkClick = onVerseLinkClick;
      $scope.onRandomVerseButtonClick = onRandomVerseButtonClick;

      $rootScope.$broadcast('HeaderCtrl.doShow');
      $rootScope.$broadcast('FooterCtrl.doShow');
      $rootScope.$broadcast('GitHubRibbonCtrl.doHide');
    }

    /**
     * Authors filter
     * @param author
     * @returns {boolean}
     */
    function authorsFilter(author) {
      // Skip if have no verses
      if (!author.verses || !author.verses.length) {
        return false;
      }
      
      // Skip test author
      if (author.name === 'test-a-t') {
        return false;
      }
      
      return true;
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

      return false;
    }
    
    function onVerseLinkClick($event, verse) {
      Analytics.trackEvent('web', 'catalog-verse-link-click');
      
      // Exit if metakey pressed
      if ($event.metaKey) {
        return;
      }

      leavePageWithNewUrl(verse.url);
      return $event.preventDefault();
    }
    
    function onRandomVerseButtonClick() {
      VerseDataStore.getRandomVerse().then(function(verse) {
        leavePageWithNewUrl(verse.url);

        Analytics.trackEvent('web', 'catalog-random-verse-btn-click');
      });
    }
  });
