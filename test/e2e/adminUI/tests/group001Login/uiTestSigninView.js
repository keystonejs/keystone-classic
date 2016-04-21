module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinPage');
	},
	after: function (browser) {
		browser.end();
	},
	'AdminUI should have a signin page': function (browser) {
		browser.app
			.expect.element('@signinPage').to.be.visible;
	},
	'Signin page should have an email field': function (browser) {
		browser.signinPage
			.expect.element('@emailInput').to.be.visible;
	},
	'Signin page should have an password field': function (browser) {
		browser.signinPage
			.expect.element('@passwordInput').to.be.visible;
	},
	'Signin page should have a submit button': function (browser) {
		browser.signinPage
			.expect.element('@submitButton').to.be.visible;
	},
};
