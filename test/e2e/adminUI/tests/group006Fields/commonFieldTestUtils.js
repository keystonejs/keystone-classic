module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();

		browser.adminUIApp.gotoSigninScreen();
		browser.adminUISigninScreen.signin();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	}
};
