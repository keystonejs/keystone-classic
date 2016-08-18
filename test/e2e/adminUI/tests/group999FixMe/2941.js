module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();

		browser.app.gotoHomeScreen();
		browser.app.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 2941': function(browser) {
		// Create items
		browser.app.openMiscList('HiddenRelationship');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();


		// Issue demonstration - the field should not be visible, but it is.

		browser.initialFormScreen.section.form.section.hiddenrelationshipList.section.fieldA
			.expect.element('@label').to.not.be.visible;

		browser.initialFormScreen.cancel();

	}
};
