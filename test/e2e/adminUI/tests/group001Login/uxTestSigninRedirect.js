module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISignin = browser.page.adminUISignin();

		browser.url(browser.app.url + 'users');
		browser.adminUIApp.waitForSigninScreen();
		browser.assert.urlEquals(browser.app.url + 'signin?from=/keystone/users');
	},
	after: function (browser) {
		browser.
			end();
	},
	'AdminUI should allow users to login and redirect to custom url': function (browser) {
		browser.adminUISignin.signin();
		browser.adminUIApp.waitForListScreen();
		browser.assert.urlEquals(browser.app.url + 'users');
	},
};
