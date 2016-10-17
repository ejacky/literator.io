'use strict';

describe('Service: VerseDataStore', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  var VerseDataStore;
  var $httpBackend;
  var mockedStructure = {
    "authors": [
      {
        "name": "pushkin-a-s",
        "fullName": "Пушкин Александр Сергеевич",
        "shortName": "Пушкин А. С.",
        "birthYear": 1799,
        "deathYear": 1837,
        "wikiLink": "https://ru.wikipedia.org/wiki/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD,_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80_%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B5%D0%B2%D0%B8%D1%87",
        "studiedInCountries": ["ru", "ua", "by", "kz"]
      },

      {
        "name": "lermontov-m-yu",
        "fullName": "Лермонтов Михаил Юрьевич",
        "shortName": "Лермонтов М. Ю.",
        "birthYear": 1814,
        "deathYear": 1841,
        "wikiLink": "https://ru.wikipedia.org/wiki/%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2,_%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB_%D0%AE%D1%80%D1%8C%D0%B5%D0%B2%D0%B8%D1%87",
        "studiedInCountries": ["ru", "us"]
      }
    ],

    "verses": [
      {
        "name": "u-lukomorya-dub-zelyonyj",
        "title": "У лукоморья дуб зелёный",
        "description": "Из поэмы \"Руслан и Людмила\"",
        "path": "/resources/verses/pushkin_a_s/u-lukomorya-dub-zelyonyj",
        "authorName": "pushkin-a-s"
      },

      {
        "name": "parus",
        "title": "Парус",
        "year": 1832,
        "authorName": "lermontov-m-yu"
      }
    ]
  };

  beforeEach(inject(function ($injector, _VerseDataStore_) {
    // Mock backend with $httpBackend
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('i18n/en.json').respond('');
    $httpBackend.whenGET('i18n/ru.json').respond('');
    $httpBackend.expectGET('resources/verses/structure.json').respond(JSON.stringify(mockedStructure));

    VerseDataStore = _VerseDataStore_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load correct structure data', function () {
    VerseDataStore.getDataStructure().then(function(data){
      expect(data.authors).toBeDefined('authors should be defined');
      expect(data.verses).toBeDefined('verses should be defined');
    });

    $httpBackend.flush();
  });

  it('should return correct author list', function () {
    VerseDataStore.getAuthorsList().then(function(authors){
      expect(authors.length).toBe(2);
    });

    VerseDataStore.getAuthorsList('ru').then(function(authors){
      expect(authors.length).toBe(2);
    });

    VerseDataStore.getAuthorsList('us').then(function(authors){
      expect(authors.length).toBe(1);
    });

    VerseDataStore.getAuthorsList('zz').then(function(authors){
      expect(authors.length).toBe(0);
    });

    $httpBackend.flush();
  });

  it('should return correct author', function () {
    VerseDataStore.getAuthorByName(mockedStructure.authors[0].name).then(function(author){
      expect(author).toBeDefined('author should be defined');
      expect(author.fullName).toBe(mockedStructure.authors[0].fullName, 'fullname should match');
    });

    $httpBackend.flush();
  });

  it('should return random verse', function () {
    VerseDataStore.getRandomVerse().then(function(verse){
      expect(verse).toBeDefined('verse should be defined');
      expect(verse.title).toBeDefined('title should be defined');
    });

    VerseDataStore.getRandomVerse('kz').then(function(verse){
      expect(verse).toBeDefined('verse for "ru" should be defined');
      expect(verse.title).toBe(mockedStructure.verses[0].title);
    });

    VerseDataStore.getRandomVerse('us').then(function(verse){
      expect(verse).toBeDefined('verse for "us" should be defined');
      expect(verse.title).toBe(mockedStructure.verses[1].title);
    });

    VerseDataStore.getRandomVerse('zz').then(function(verse){
      expect(verse).toBeNull('verse for "zz" should be null');
    });

    $httpBackend.flush();
  });

  it('should return random verse for author passed', function () {
    VerseDataStore.getRandomVerseForAuthor('pushkin-a-s').then(function(verse){
      expect(verse).toBeDefined('verse should be defined');
      expect(verse.authorName).toBe('pushkin-a-s', 'author should match');
    });

    $httpBackend.flush();
  });

  it('should return verse by author and name', function () {
    VerseDataStore.getVerseByAuthorAndName('lermontov-m-yu', 'parus').then(function(verse){
      expect(verse).toBeDefined('verse should be defined');
      expect(verse.title).toBeDefined('Парус');
    });

    $httpBackend.flush();
  });

});
