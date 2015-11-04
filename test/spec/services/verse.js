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

  beforeEach(inject(function ($injector, _Verse_) {
    // Mock backend with $httpBackend
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('/languages/ru-RU.json').respond('');

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
    var mockVerseContent = 'Test content';
    $httpBackend.expectGET(verse.path + '/content.txt').respond(mockVerseContent);

    verse.loadContent().then(function(){
      expect(verse.content).toBe(mockVerseContent);
    });

    $httpBackend.flush();
  });

  it('should replace hyphens to proper dashes (typography)', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('content-content content -content content - content');

    verse.loadContent().then(function(){
      expect(verse.content).toBe('content-content content —content content — content');
    });

    $httpBackend.flush();
  });

  it('should cleanup content from non-Unix line breaks', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('content\r\ncontent\rcontent\ncontent');

    verse.loadContent().then(function(){
      expect(verse.content).toBe('content\ncontent\ncontent\ncontent');
    });

    $httpBackend.flush();
  });

  it('should cleanup content from double spaces', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('content   content  content content');

    verse.loadContent().then(function(){
      expect(verse.content).toBe('content content content content');
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

  it('should return proper pieces', function () {
    var mockVerseContent = 'Word {word {word}}\nWord {word}';
    $httpBackend.expectGET(verse.path + '/content.txt').respond(mockVerseContent);

    verse.loadContent().then(function(){
      var pieces = null;

      pieces = verse.getPieces({
        difficulty: Verse.prototype.DIFFICULTY_EASY
      });
      expect(pieces.length).toBe(18, 'for easy difficulty');

      pieces = verse.getPieces({
        difficulty: Verse.prototype.DIFFICULTY_NORMAL
      });
      expect(pieces.length).toBe(13, 'for normal difficulty');
    });

    $httpBackend.flush();
  });

});
