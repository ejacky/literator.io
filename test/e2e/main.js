describe('Main page', function() {

  beforeEach(function(){
    browser.get('#/');
    browser.executeScript("document.body.className += ' notransitions';");
  });

  it('should load', function() {
    var el = element(by.css('.view-main .logo'));
    browser.driver.wait(protractor.until.elementIsVisible(el));
    expect(el.getText()).toMatch('\.io', 'title should match');

    var el = element(by.css('.view-main .menu .button.start'));
    browser.driver.wait(protractor.until.elementIsVisible(el));
    expect(el.getText()).not.toMatch('{', '"Start" button displayed properly');
  });

  it('"Start" button should work', function() {
    element(by.css('.view-main .menu .button.start')).click();

    expect(browser.getCurrentUrl()).toMatch('verse\/', 'URL should match');

    var el = element(by.css('.view-verse .top .title'));
    expect(el.getText()).not.toMatch('{', 'verse title displayed properly');
  });
});
