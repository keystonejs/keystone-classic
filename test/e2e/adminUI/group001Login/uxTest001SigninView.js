module.exports = {
  before : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('#signin-view')
	  .pause(browser.globals.defaultPauseTimeout);
  },
  after : function (browser) {
	browser
	  .end();
  },
  'AdminUI should allow users to login' : function (browser) {
	browser
	  .setValue('input[name=email]', browser.globals.adminUI.login.email)
	  .setValue('input[name=password]', browser.globals.adminUI.login.password)
	  .click('button[type=submit]')
	  .pause(browser.globals.defaultPauseTimeout)
	  .url(browser.globals.adminUI.url)  // just in case we're redirected somewhere other than home page
	  .waitForElementVisible('#home-view')
	  .pause(browser.globals.defaultPauseTimeout)
  },
  'AdminUI should allow users to logout' : function (browser) {
	browser
	  .click('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
	  .waitForElementVisible('#signin-view')
	  .pause(browser.globals.defaultPauseTimeout);
  },
};
