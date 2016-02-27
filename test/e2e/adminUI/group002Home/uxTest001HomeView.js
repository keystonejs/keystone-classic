module.exports = {
  before : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('#signin-view')
	  .setValue('input[name=email]', browser.globals.adminUI.login.email)
	  .setValue('input[name=password]', browser.globals.adminUI.login.password)
	  .click('button[type=submit]')
	  .pause(browser.globals.defaultPauseTimeout);
  },
  after : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('#home-view')
	  .pause(browser.globals.defaultPauseTimeout)
	  .click('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
	  .pause(browser.globals.defaultPauseTimeout)
	  .end();
  },
  'Home view should allow clicking a nav menu item such as Access to show the list of items' : function (browser) {
	browser
		.url(browser.globals.adminUI.url)
		.waitForElementVisible('#home-view')
		.pause(browser.globals.defaultPauseTimeout)
		.click('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(2) > a')
		.waitForElementVisible('#list-view')
		.pause(browser.globals.defaultPauseTimeout)
  },
  'Home view should allow clicking a card list item such as Users to should show the list of those items' : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('#home-view')
	  .pause(browser.globals.defaultPauseTimeout)
	  .click('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile')
	  .waitForElementVisible('#list-view')
	  .pause(browser.globals.defaultPauseTimeout)
  },
  'Home view should allow an admin to create a new list item such as a user' : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('#home-view')
	  .pause(browser.globals.defaultPauseTimeout)
	  .click('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
	  .waitForElementVisible('.Modal-content')
	  .pause(browser.globals.defaultPauseTimeout);
  },
  'Home view should be accessible from any other non-modal view by clicking the Home link' : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('#home-view')
	  .pause(browser.globals.defaultPauseTimeout)
	  .click('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile')
	  .waitForElementVisible('#list-view')
	  .pause(browser.globals.defaultPauseTimeout)
	  .click('#list-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(1) > a > span')
	  .waitForElementVisible('#home-view')
	  .pause(browser.globals.defaultPauseTimeout);
  },
};
