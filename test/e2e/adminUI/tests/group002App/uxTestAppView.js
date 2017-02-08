var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();

		browser.adminUIApp.gotoSigninScreen();
		browser.adminUISigninScreen.signin();
	},
	after: function (browser) {
		browser.end();
	},
	'AdminUI app should allow navigating to the home screen by clicking the home icon': function (browser) {
		browser.adminUIApp.clickUIElement({ element: '@homeIcon' });
		browser.adminUIApp.waitForHomeScreen();
	},
	'AdminUI app should allow navigating to the front page by clicking the Front Page Icon': function (browser) {
		browser.adminUIApp.clickUIElement({ element: '@frontPageIcon' });
		browser.adminUIApp.assertElementTextEquals({ element: 'body > h2', text: 'Welcome to the e2e test front page...make sure they all pass :=)' });
	},
	'AdminUI app should allow navigating to the signin screen by clicking the Logout Icon': function (browser) {
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.clickUIElement({ element: '@logoutIcon' });
		browser.adminUIApp.waitForSigninScreen();
	},
};
