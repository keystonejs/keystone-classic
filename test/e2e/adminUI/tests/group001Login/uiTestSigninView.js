module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');
	},
	after: function (browser) {
		browser.end();
	},
	'AdminUI should have a signin page': function (browser) {
		browser.app
			.expect.element('@signinScreen').to.be.visible;
	},
	'Signin page should show correctly': function (browser) {
		browser.signinPage.assertUI();
	},
};
