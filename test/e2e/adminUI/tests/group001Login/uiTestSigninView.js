module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();

		browser.adminUIApp.gotoSigninScreen();
	},
	after: function (browser) {
		browser.end();
	},
	'Signin page should show correctly': function (browser) {
		browser.adminUISigninScreen.assertUI();
	},
};
