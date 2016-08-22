module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();

		browser.app
			.gotoHomeScreen()
			.waitForSigninScreen();
	},
	after: function (browser) {
		browser.end();
	},
	'Signin page should allow users to login': function (browser) {
		browser.signinScreen.signin();
		browser.app.waitForHomeScreen();
	},
	'Signin page should be presented upon signout': function (browser) {
		browser.app
			.signout()
			.waitForSigninScreen();
	},
};
