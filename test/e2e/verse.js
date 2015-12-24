describe('Verse page', function() {
  beforeEach(function(){
    browser.get('#/verse/test-a-t/test');
    browser.executeScript("document.body.className += ' notransitions';");
  });

  it('should load', function() {
    expect($('.view-verse .top .title').getText()).toBe('Винни-Пух', 'verse title displayed properly');

    var input = $('.view-verse .content input');
    expect(input.isPresent()).toBe(true, 'input field present');
  });

  it('can finish verse', function() {
    var input = $('.view-verse .content input');
    expect(input.isPresent()).toBe(true, 'input field present');

    // Wait for input to appear
    browser.driver.wait(input.isDisplayed);
    expect(input.isDisplayed()).toBe(true, 'input field displayed');

    // Should auto-complete on correct phrase
    input.sendKeys('пчёл');
    expect(input.isDisplayed()).toBe(false, 'should auto-complete on correct phrase');

    // Should continue on long wait
    browser.driver.wait(input.isDisplayed);
    expect(input.isDisplayed()).toBe(true, 'input field displayed');
    browser.driver.wait(protractor.ExpectedConditions.invisibilityOf(input), 17000, 'should continue on long wait');
    expect(input.isDisplayed()).toBe(false, 'should continue on long wait');

    // Should skip other difficulty block
    // Do nothing

    // Should auto-complete on transliterated phrase
    browser.driver.wait(input.isDisplayed);
    expect(input.isDisplayed()).toBe(true, 'input field displayed');
    input.sendKeys('pod');
    expect(input.isDisplayed()).toBe(false, 'should auto-complete on transliterated phrase');

    // Should finish verse
    browser.driver.wait(input.isDisplayed);
    expect(input.isDisplayed()).toBe(true, 'input field displayed');
    input.sendKeys('дом');
    expect(input.isDisplayed()).toBe(false, 'should auto-complete on correct phrase');

    // Wait until result appears
    browser.driver.wait($('.bottom .ending').isDisplayed);
    expect($('.bottom .ending .result').getText()).toMatch(/\d+ sec./, 'should display proper result');

    // Can click on "Another verse"
    var oldUrl = browser.getCurrentUrl();
    element(by.css('.bottom .another-verse')).click();
    expect(browser.getCurrentUrl()).not.toBe(oldUrl, 'URL should be different');

  }, 35000); // need to give it 35 sec on that test

});
