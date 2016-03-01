'use strict';

exports.config = {
  // seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.42.0.jar',
  // chromeDriver: '../node_modules/protractor/selenium/chromedriver',

  // location of E2E test specs
  specs: [
    '../test/e2e/*.js'
  ],

  // configure multiple browsers to run tests
  // multiCapabilities: [{
  //   'browserName': 'firefox'
  // }, {
  //   'browserName': 'chrome'
  // }, {
  //   'browserName': 'safari'
  // }],

  // or configure a single browser

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      // How to set browser language (menus & so on)
      args: [
        'lang=en-US'
      ],

      // How to set Accept-Language header
      prefs: {
        intl: {
          accept_languages: 'en-US'
        }
      }
    }
  },


  // url where your app is running, relative URLs are prepending with this URL
  baseUrl: 'http://localhost:9000/',

  // testing framework, jasmine is the default
  framework: 'jasmine2'
};
