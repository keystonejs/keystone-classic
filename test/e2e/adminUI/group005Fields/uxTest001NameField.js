module.exports = {
  before : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('div#signin-view')
	  .setValue('input[name=email]', browser.globals.adminUI.login.email)
	  .setValue('input[name=password]', browser.globals.adminUI.login.password)
	  .click('button[type=submit]')
	  .pause(1000)
	  .url(browser.globals.adminUI.url)
	  .pause(1000);
  },
  after : function (browser) {
	browser
	  .click('div#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
	  .pause(1000)
	  .end();
  },
  'TODO' : function (browser) {
	  // TODO: Create ux/functional tests
  },
};
