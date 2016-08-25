module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();

		browser.adminUIApp
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	}
};
