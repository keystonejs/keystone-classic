module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Demonstrate issue 2941': function(browser) {
		// Create items
		browser.adminUIApp.openMiscList('HiddenRelationship');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();


		// Issue demonstration - the field should not be visible, but it is.

		browser.initialFormScreen.section.form.section.hiddenrelationshipList.section.fieldA
			.expect.element('@label').to.not.be.visible;

		browser.initialFormScreen.cancel();

	}
};
