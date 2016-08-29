module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISignin = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();

		browser.app.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISignin.signin();

		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	}
};
