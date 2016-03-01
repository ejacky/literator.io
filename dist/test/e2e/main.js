describe('Main page', function() {

  beforeEach(function(){
    browser.get('#/');
    browser.executeScript("document.body.className += ' notransitions';");
    browser.driver.sleep(300);
  });

  it('should load', function() {
    var el = $('.view-main .logo');
    browser.driver.wait(protractor.until.elementIsVisible(el));
    expect(el.isPresent()).toBe(true, 'logo shown');

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
