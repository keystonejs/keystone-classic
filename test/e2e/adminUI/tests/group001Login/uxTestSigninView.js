module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();

		browser.adminUIApp.gotoSigninScreen();
		browser.adminUIApp.waitForSigninScreen();
	},
	after: function (browser) {
		browser.end();
	},
	'Signin page should allow users to login': function (browser) {
		browser.adminUISigninScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	'Signin page should be presented upon signout': function (browser) {
		browser.adminUIApp
			.signout()
			.waitForSigninScreen();
	},
};
