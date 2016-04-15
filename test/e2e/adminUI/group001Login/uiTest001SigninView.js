module.exports = {
	before: function (browser) {
		browser.signinPage = browser.page.signin();

		browser.signinPage
			.navigate();
	},
	after: function (browser) {
		browser
			.end();
	},
	'AdminUI should have a signin view': function (browser) {
		browser.signinPage
			.expect.element('@view').to.be.visible;
	},
	'Signin view should have an email field': function (browser) {
		browser.signinPage
			.expect.element('@emailInput').to.be.visible;
	},
	'Signin view should have an password field': function (browser) {
		browser.signinPage
			.expect.element('@passwordInput').to.be.visible;
	},
	'Signin view should have a submit button': function (browser) {
		browser.signinPage
			.expect.element('@submitButton').to.be.visible;
	},
};
