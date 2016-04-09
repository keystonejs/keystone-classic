var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser.adminUI = browser.page.spa();
		browser.signinPage = browser.page.signin();

		browser.signinPage
			.navigate();
	},
	after: function (browser) {
		browser
			.end();
	},
	'Signin page should allow users to login': function (browser) {
		browser.signinPage
			.signin();
		browser.adminUI
			.waitForElementVisible('@homeView');
	},
	'Signin page should be presented upon logout': function (browser) {
		browser.adminUI
			.logout();
	},
};
