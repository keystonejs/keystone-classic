module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISignin = browser.page.adminUISignin();
		browser.app.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();
	},
	after: function (browser) {
		browser.end();
	},
	'Signin page should show correctly': function (browser) {
		browser.adminUISignin.assertUI();
	},
};
