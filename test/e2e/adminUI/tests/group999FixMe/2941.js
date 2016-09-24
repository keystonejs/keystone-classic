module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Demonstrate issue 2941': function(browser) {
		// Create items
		browser.adminUIApp.openList({section: 'Miscs', list: 'HiddenRelationship'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();


		// Issue demonstration - the field should not be visible, but it is.

		browser.adminUIInitialFormScreen.section.form.section.hiddenrelationshipList.section.fieldA
			.expect.element('@label').to.not.be.visible;

		browser.adminUIInitialFormScreen.cancel();

	}
};
