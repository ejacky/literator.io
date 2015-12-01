'use strict';

describe('Service: VerseDataStore', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  var VerseDataStore;
  var $httpBackend;
  var mockedStructure = {
    "authors": [
      {
        "name": "pushkin_a_s",
        "fullName": "Пушкин Александр Сергеевич",
        "shortName": "Пушкин А. С."
      }
    ],

    "verses": [
      {
        "name": "u-lukomorya-dub-zelyonyj",
        "title": "У лукоморья дуб зелёный",
        "description": "Из поэмы \"Руслан и Людмила\"",
        "path": "/resources/verses/pushkin_a_s/u-lukomorya-dub-zelyonyj",
        "author": "pushkin_a_s"
      }
    ]
  };

  beforeEach(inject(function ($injector, _VerseDataStore_) {
    // Mock backend with $httpBackend
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.expectGET('/languages/ru-RU.json').respond('');
    $httpBackend.expectGET('/resources/verses/structure.json').respond(JSON.stringify(mockedStructure));

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

  it('should return correct author', function () {
    VerseDataStore.getAuthorByName(mockedStructure.authors[0].name).then(function(author){
      expect(author).toBeDefined('author should be defined');
      expect(author.fullName).toBe(mockedStructure.authors[0].fullName, 'fullname should match');
    });

    $httpBackend.flush();
  });

  it('should be able to get random verse', function () {
    VerseDataStore.getRandomVerse().then(function(verse){
      expect(verse).toBeDefined('verse should be defined');
      expect(verse.title).toBeDefined('title should be defined');
    });

    $httpBackend.flush();
  });

});
