module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();

		browser.adminUIApp
			.gotoHomeScreen()
			.waitForSigninScreen();
	},
	after: function (browser) {
		browser.end();
	},
	'Signin page should show correctly': function (browser) {
		browser.signinScreen.assertUI();
	},
};
