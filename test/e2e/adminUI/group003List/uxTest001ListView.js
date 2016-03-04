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
			.waitForElementVisible('#home-view')
			.pause(browser.globals.defaultPauseTimeout)
			.click('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(2) > a')
			.waitForElementVisible('#list-view')
			.pause(browser.globals.defaultPauseTimeout)
	},
	after: function (browser) {
		browser
			.end();
	},
	// *** THIS TEST CASE MUST BE AT THE END SINCE IT DOES LOGOUT ***
	'List view should allow the user to logout': function (browser) {
		browser
			.click('#list-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li.active > a')
			.waitForElementVisible('#list-view')
			.pause(browser.globals.defaultPauseTimeout)
			.click('#list-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
			.pause(browser.globals.defaultPauseTimeout)
	},
};
