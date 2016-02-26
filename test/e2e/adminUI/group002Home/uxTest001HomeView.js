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
	  .url(browser.globals.adminUI.url)
	  .pause(1000)
	  .click('div#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
	  .pause(1000)
	  .end();
  },
  'Home view should allow an admin to create a new user' : function (browser) {
	  browser
		  .click('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
		  .waitForElementVisible('.Modal-content')
		  .pause(1000);
  },
};
