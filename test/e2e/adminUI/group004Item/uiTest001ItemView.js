module.exports = {
	before: function (browser) {
		browser
			.url(browser.globals.adminUI.url)
			.waitForElementVisible('#signin-view')
			.setValue('input[name=email]', browser.globals.adminUI.login.email)
			.setValue('input[name=password]', browser.globals.adminUI.login.password)
			.click('button[type=submit]')
			.pause(browser.globals.defaultPauseTimeout)
			.url(browser.globals.adminUI.url)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'TODO': function (browser) {
		// TODO: Create ui tests
	},
};
