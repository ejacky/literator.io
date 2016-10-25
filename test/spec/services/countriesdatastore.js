'use strict';

describe('Service: CountriesDataStore', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  // instantiate service
  var CountriesDataStore;
  beforeEach(inject(function (_CountriesDataStore_) {
    CountriesDataStore = _CountriesDataStore_;
  }));

  it('should return available countries', function () {
    expect(CountriesDataStore.getAvailableCountries().length >= 2).toBe(true);
  });

  it('should return proper country by code', function () {
    var country = CountriesDataStore.getCountryByCode('ru');

    expect(country).toBeDefined();
    expect(country.title).toBe('Россия');
  });

  it('should be able to set country', function () {
    var currentCountry;
    var countryRU = CountriesDataStore.getCountryByCode('ru');
    var countryIE = CountriesDataStore.getCountryByCode('ie');

    CountriesDataStore.setCurrentCountry(countryRU);
    currentCountry = CountriesDataStore.getCurrentCountry();
    expect(currentCountry).toBeDefined();
    expect(currentCountry.countryCode).toBe(countryRU.countryCode);

    CountriesDataStore.setCurrentCountry(countryIE);
    currentCountry = CountriesDataStore.getCurrentCountry();
    expect(currentCountry).toBeDefined();
    expect(currentCountry.countryCode).toBe(countryIE.countryCode);
  });

  it('should properly detect country', function () {
    var detectedCountry = null;
    var allCountries = [
      {countryCode: 'ru', title: 'Россия', languageCodes: ['ru', 'ru-RU'], language: 'ru'},
      {countryCode: 'ie', title: 'Ireland', languageCodes: ['ie', 'en-IE', 'ga-IE', 'gd-IE', 'ga', 'en-GB', 'en'], language: 'en'},
      {countryCode: 'us', title: 'USA', languageCodes: ['us', 'en-US', 'en'], language: 'en'},
    ];

    detectedCountry = CountriesDataStore.determineCountryByLanguage(['ru', 'en-US', 'en'], allCountries);
    expect(detectedCountry).toBeDefined();
    expect(detectedCountry.countryCode).toBe(allCountries[0].countryCode);

    detectedCountry = CountriesDataStore.determineCountryByLanguage(['ru-RU'], allCountries);
    expect(detectedCountry).toBeDefined();
    expect(detectedCountry.countryCode).toBe(allCountries[0].countryCode);

    detectedCountry = CountriesDataStore.determineCountryByLanguage(['en-IE'], allCountries);
    expect(detectedCountry).toBeDefined();
    expect(detectedCountry.countryCode).toBe(allCountries[1].countryCode);

    detectedCountry = CountriesDataStore.determineCountryByLanguage(['en-US'], allCountries);
    expect(detectedCountry).toBeDefined();
    expect(detectedCountry.countryCode).toBe(allCountries[2].countryCode);

    detectedCountry = CountriesDataStore.determineCountryByLanguage(['en-US', 'en', 'it'], allCountries);
    expect(detectedCountry).toBeDefined();
    expect(detectedCountry.countryCode).toBe(allCountries[2].countryCode);
  });

  it('should return proper mark for percents', function () {
    var country = CountriesDataStore.getCountryByCode('ru');

    expect(CountriesDataStore.getMarkForPercents(100, country)).toBe('5+');
    expect(CountriesDataStore.getMarkForPercents(45, country)).toBe('3');
    expect(CountriesDataStore.getMarkForPercents(79, country)).toBe('4+');
    expect(CountriesDataStore.getMarkForPercents(95, country)).toBe('5');
  });
  
});
