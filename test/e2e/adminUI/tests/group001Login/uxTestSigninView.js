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
	'Signin page should allow users to login': function (browser) {
		browser.adminUISignin.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	'Signin page should be presented upon signout': function (browser) {
		browser.adminUIApp
			.signout()
			.waitForSigninScreen();
	},
};
