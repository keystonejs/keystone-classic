module.exports = {
	before: function (browser) {
		browser.adminUI = browser.page.spa();
		browser.signinPage = browser.page.signin();

		browser.url(browser.adminUI.url + 'users')
		browser.adminUI
			.waitForElementVisible('@signinView')
			.assert.urlEquals(browser.adminUI.url + 'signin?from=/keystone/users')
			.pause();
	},
	after: function (browser) {
		browser.
			end();
	},
	'AdminUI should allow users to login and redirect to custom url': function (browser) {
		browser.signinPage
			.signin();
		browser.adminUI
			.waitForElementVisible('@listView')
			.assert.urlEquals(browser.adminUI.url + 'users');
	},
};
