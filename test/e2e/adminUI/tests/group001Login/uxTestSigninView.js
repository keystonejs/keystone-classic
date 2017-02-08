module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();

		browser.adminUIApp.gotoSigninScreen();
	},
	after: function (browser) {
		browser.end();
	},
	'Signin page should allow users to login': function (browser) {
		browser.adminUISigninScreen.signin();
		browser.adminUIApp.assertElementIsVisible({ element: '@homeScreen' });
	},
	'Signin page should be presented upon signout': function (browser) {
		browser.adminUIApp.signout();
		browser.adminUIApp.assertElementIsVisible({ element: '@signinScreen' });
	},
};
