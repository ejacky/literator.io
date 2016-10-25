'use strict';

/**
 * @ngdoc service
 * @name literatorioApp.CountriesDataStore
 * @description
 * # CountriesDataStore
 * Service in the literatorioApp.
 */
angular.module('literatorioApp')
  .service('CountriesDataStore', function ($rootScope, $translate, $window, _) {

    var localStorageCurrentCountryCodeKey = 'CountriesDataStore.currentCountryCode';
    var availableCountries = [
      {
        countryCode: 'ru',
        title: 'Россия',
        languageCodes: ['ru', 'ru-RU'],
        language: 'ru',
        percentsToMark: function (val) {
          return val < 50 ? '3' : (val < 60 ? '4-' : (val < 70 ? '4' : (val < 80 ? '4+' : (val < 90 ? '5-' : (val < 99 ? '5' : '5+')))));
        }
      },
      {
        countryCode: 'us',
        title: 'USA',
        languageCodes: ['us', 'en-US', 'en'],
        language: 'en',
        percentsToMark: function (val) {
          return val < 50 ? 'D' : (val < 60 ? 'C' : (val < 70 ? 'B-' : (val < 80 ? 'B' : (val < 90 ? 'A-' : (val < 99 ? 'A' : 'A+')))));
        }
      },
      {
        countryCode: 'ie',
        title: 'Ireland',
        languageCodes: ['ie', 'en-IE', 'ga-IE', 'gd-IE', 'ga', 'en-GB', 'en'],
        language: 'en',
        percentsToMark: function (val) {
          return val < 50 ? 'D' : (val < 60 ? 'C' : (val < 70 ? 'B-' : (val < 80 ? 'B' : (val < 90 ? 'A-' : (val < 99 ? 'A' : 'A+')))));
        }
      }
    ];
    var fallbackCountryCode = 'ru';
    var currentCountry = null;

    init();

    // Public API
    return {
      getAvailableCountries: getAvailableCountries,
      getCountryByCode: getCountryByCode,
      getCurrentCountry: getCurrentCountry,
      setCurrentCountry: setCurrentCountry,
      getMarkForPercents: getMarkForPercents,
      determineCountryByLanguage: determineCountryByLanguage
    };


    /**
     * Initializes service
     */
    function init() {
      // Try to get proper country
      var country = getCountryByCode($window.localStorage.getItem(localStorageCurrentCountryCodeKey))
        || determineCountryByLanguage($window.navigator.languages || [$window.navigator.language || $window.navigator.userLanguage])
        || getCountryByCode(fallbackCountryCode);
      setCurrentCountry(country);
    }

    /**
     * Returns available countries
     * @returns {Array}
     */
    function getAvailableCountries() {
      return availableCountries;
    }

    /**
     * Returns country by code passed
     * @param {String} countryCode
     * @returns {Object}
     */
    function getCountryByCode(countryCode) {
      return _.findWhere(availableCountries, {countryCode: countryCode});
    }

    /**
     * Determines and returns current country
     * @returns {Object}
     */
    function getCurrentCountry() {
      return currentCountry;
    }

    /**
     * Sets current country
     * @param {Object} country
     */
    function setCurrentCountry(country) {
      currentCountry = country;

      // Change language
      $translate.use(country.language);

      // Save selected country
      try {
        $window.localStorage.setItem(localStorageCurrentCountryCodeKey, country.countryCode);
      } catch (e) {}

      $rootScope.global.currentLang = country.language;
    }

    /**
     * Returns country determined by input params and special algo
     * @param {Array} languages
     * @param {Array} [countries]
     * @returns {Object|null}
     */
    function determineCountryByLanguage(languages, countries) {
      var lowerCaseLanguages = languages.map(function(value){return ('' + value).toLowerCase();});

      if (!countries) {
        countries = getAvailableCountries();
      }

      // Try to determine best matching country
      var detectedCountry = null;
      var currentMinimum = null;
      countries.forEach(function(country) {
        country.languageCodes.forEach(function(languageCode) {
          languageCode = languageCode.toLowerCase();

          var index = lowerCaseLanguages.indexOf(languageCode);

          // Check if current languageCode closer to the beginning of the list, i.e. if country match is better
          if (index !== -1 && (currentMinimum === null || (index / country.languageCodes.length) < currentMinimum)) {
            currentMinimum = (index / country.languageCodes.length);
            detectedCountry = country;
          }
        });
      });

      return detectedCountry;
    }

    /**
     * Returns localized mark for percents result
     * @param {number} percents
     * @param {Object} [country]
     * @returns {string}
     */
    function getMarkForPercents(percents, country) {
      if (!country) {
        country = getCurrentCountry();
      }
      
      if (!country.percentsToMark) {
        return null;
      }

      return country.percentsToMark(percents);
    }
  });
