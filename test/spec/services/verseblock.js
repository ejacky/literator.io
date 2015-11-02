'use strict';

describe('Service: VerseBlock', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  // instantiate service
  var VerseBlock;
  beforeEach(inject(function (_VerseBlock_) {
    VerseBlock = _VerseBlock_;
  }));

  it('should be properly initialized', function () {
    var testString = 'adsf9*AD9uiadsfjk';
    var verseBlock = new VerseBlock(testString);

    expect(verseBlock).toBeDefined();
    expect(!!verseBlock.toString()).toBe(true);
  });

  it('should be properly converted to string', function () {
    var testString = 'adsf9*AD9uiadsfjk';
    var verseBlock = new VerseBlock(testString);

    expect(verseBlock).toBeDefined();
    expect(verseBlock + '123').toBe(testString + '123');
  });

  it('should match against passed string', function () {
    var verseBlock = new VerseBlock('зелёный');

    expect(verseBlock).toBeDefined();
    expect(verseBlock.match('зелёный', 3)).toBe(true, 'exact match');
    expect(verseBlock.match('зелеfds', 3)).toBe(true, 'partial match');
    expect(verseBlock.match('ЗеЛен', 3)).toBe(true, 'case-insensitive match');
    expect(verseBlock.match('зеленый', 4)).toBe(true, 'е-ё match');
  });

});
