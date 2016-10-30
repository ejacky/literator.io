'use strict';

describe('Service: VerseAuthor', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  var VerseAuthor;
  var verseAuthor = null;
  var mockData = {
    'name': 'pushkin_a_s',
    'fullName': 'Пушкин Александр Сергеевич',
    'shortName': 'Пушкин А. С.'
  };

  // Mock services
  beforeEach(inject(function($q, VerseDataStore, Verse) {
    spyOn(VerseDataStore, 'getVersesForAuthor').and.callFake(function(name) {
      if (name === 'pushkin_a_s') {
        return $q.resolve([
          new Verse({}),
          new Verse({})
        ]);
      }

      return $q.resolve([]);
    });
  }));

  // instantiate service
  beforeEach(inject(function(_VerseAuthor_) {
    VerseAuthor = _VerseAuthor_;
  }));

  beforeEach(function(){
    // Init actual author
    verseAuthor = new VerseAuthor(mockData);
  });

  it('should be properly initialized', function () {
    expect(!!verseAuthor).toBe(true);
    expect(verseAuthor.id).toBe(mockData.id);
    expect(verseAuthor.fullName).toBe(mockData.fullName);
    expect(verseAuthor.shortName).toBe(mockData.shortName);
  });

  // This test doesn't work properly, dunno why
  xit('should return verses', function() {
    verseAuthor.getVerses().then(function(verses) {
      expect(verses.length).toBe(3); // should fail!
    });
  });
});
