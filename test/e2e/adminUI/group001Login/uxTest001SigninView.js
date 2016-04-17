module.exports = {
	before: function (browser) {
		browser.spa = browser.page.spa();
		browser.signinPage = browser.page.signin();

		browser.spa.navigate();
		browser.spa.waitForElementVisible('@signinPage');
	},
	after: function (browser) {
		browser.end();
	},
	'Signin page should allow users to login': function (browser) {
		browser.signinPage
			.signin();
		browser.spa
			.waitForElementVisible('@homePage');
	},
	'Signin page should be presented upon signout': function (browser) {
		browser.spa
			.signout();
	},
};
