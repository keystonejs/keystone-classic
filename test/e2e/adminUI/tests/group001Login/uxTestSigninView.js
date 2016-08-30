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
	'Signin page should allow users to login': function (browser) {
		browser.signinScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	'Signin page should be presented upon signout': function (browser) {
		browser.adminUIApp
			.signout()
			.waitForSigninScreen();
	},
};
