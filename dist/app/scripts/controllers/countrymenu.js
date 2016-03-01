'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:CountryMenuCtrl
 * @description
 * # CountryMenuCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('CountryMenuCtrl', function ($scope, CountriesDataStore) {

    init();


    /**
     * Initializes controller
     */
    function init() {
      // Populate scope
      $scope.countries = CountriesDataStore.getAvailableCountries();
      $scope.currentCountry = CountriesDataStore.getCurrentCountry();
      $scope.onCountryChange = onCountryChange;
    }

    /**
     * Changes current country for app
     * @param {Object} country
     */
    function onCountryChange(country) {
      CountriesDataStore.setCurrentCountry(country);
      $scope.currentCountry = CountriesDataStore.getCurrentCountry();
    }
  });
