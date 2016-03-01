'use strict';

describe('Service: VerseAuthor', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  var VerseAuthor;
  var verseAuthor = null;
  var mockData = {
    'id': 'pushkin_a_s',
    'fullName': 'Пушкин Александр Сергеевич',
    'shortName': 'Пушкин А. С.'
  };

  // instantiate service
  beforeEach(inject(function (_VerseAuthor_) {
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

});
