'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('MainCtrl', function ($rootScope, $scope, $location, $timeout, $translate, VerseDataStore) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      $rootScope.pageTitle = $translate.instant('COMMON_APP_NAME');

      // Populate scope
      $scope.isLeaving = false;
      $scope.onStartButtonClick = onStartButtonClick;

      // Show header and footer
      setTimeout(function(){
        $rootScope.$broadcast('HeaderCtrl.doShow');
        $rootScope.$broadcast('FooterCtrl.doShow');
      }, 3000); // sync with animation
    }

    /**
     * Callback firing on start button click
     */
    function onStartButtonClick() {
      VerseDataStore.getRandomVerse().then(function(verse) {
        leavePageWithNewUrl(verse.url);
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
    }
  });
