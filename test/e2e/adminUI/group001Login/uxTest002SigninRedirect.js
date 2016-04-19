module.exports = {
	before: function (browser) {
		browser.spa = browser.page.spa();
		browser.signinPage = browser.page.signin();

		browser.url(browser.spa.url + 'users');
		browser.spa
			.waitForElementVisible('@signinPage')
			.assert.urlEquals(browser.spa.url + 'signin?from=/keystone/users');
	},
	after: function (browser) {
		browser.
			end();
	},
	'AdminUI should allow users to login and redirect to custom url': function (browser) {
		browser.signinPage
			.signin();
		browser.spa
			.waitForElementVisible('@listPage')
			.assert.urlEquals(browser.spa.url + 'users');
	},
};
