'use strict';

describe('Service: Verse', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  var Verse;
  var $httpBackend;
  var verse; // instance of concrete verse

  var mockVerseData = {
    'id': 'test_id',
    'title': 'Test title',
    'description': 'Test description',
    'path': '/test_path',
    'author': 'test_author'
  };
  var mockVerseContent = "First line\nSecond line\nThird line";

  beforeEach(inject(function ($injector, _Verse_) {
    // Mock backend with $httpBackend
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('/languages/ru-RU.json').respond('');
    $httpBackend.whenGET(mockVerseData.path + '/content.txt').respond(mockVerseContent);

    Verse = _Verse_;
  }));

  beforeEach(function(){
    // Init actual verse
    verse = new Verse(mockVerseData);
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be properly initialized', function () {
    expect(!!verse).toBe(true);
    expect(verse.id).toBe(mockVerseData.id);
    expect(verse.title).toBe(mockVerseData.title);
    expect(verse.description).toBe(mockVerseData.description);
    expect(verse.path).toBe(mockVerseData.path);
    expect(verse.author).toBe(mockVerseData.author);

    $httpBackend.flush();
  });

  it('should load its content', function () {
    verse.loadContent().then(function(){
      expect(!!verse.content).toBe(true);
    });

    $httpBackend.flush();
  });

  it('should properly normalize string to easy difficulty', function () {
    expect(verse.normalizeStringToDifficulty('The quick brown fox {jumps over the {lazy dog}}', verse.DIFFICULTY_EASY)).toBe('The quick brown fox jumps over the {lazy dog}');

    $httpBackend.flush();
  });

  it('should properly normalize string to normal difficulty', function () {
    expect(verse.normalizeStringToDifficulty('The quick brown fox {jumps over the {lazy dog}}', verse.DIFFICULTY_NORMAL)).toBe('The quick brown fox {jumps over the lazy dog}');

    $httpBackend.flush();
  });

});
