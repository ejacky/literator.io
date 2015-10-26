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
    expect(verseBlock.toString() + '123').toBe(testString + '123');
  });

});
