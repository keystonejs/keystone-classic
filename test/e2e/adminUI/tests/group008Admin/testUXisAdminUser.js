module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'A isAdmin should see the is Admin checkbox': function (browser) {
    browser.app
			.click('@accessMenu')
			.waitForElementVisible('@listScreen');

		browser.listPage.navigateToSecondItem();
		browser.app.waitForItemScreen();
		browser.app.waitForElementPresent('input[name="isAdmin"]');
	},
};
