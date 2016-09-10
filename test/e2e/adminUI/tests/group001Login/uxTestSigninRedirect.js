module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISignin = browser.page.adminUISignin();

		browser.url(browser.adminUIApp.url + 'users');
		browser.adminUIApp.waitForSigninScreen();
		browser.assert.urlEquals(browser.adminUIApp.url + 'signin?from=/keystone/users');
	},
	after: function (browser) {
		browser.
			end();
	},
	'AdminUI should allow users to login and redirect to custom url': function (browser) {
		browser.adminUISignin.signin();
		browser.adminUIApp.waitForListScreen();
		browser.assert.urlEquals(browser.adminUIApp.url + 'users');
	},
};
