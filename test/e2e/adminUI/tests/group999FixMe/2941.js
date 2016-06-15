module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 2941': function(browser) {
		// Create items
		browser.app.openMiscList('HiddenRelationship');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();


		// Issue demonstration - the field should not be visible, but it is.

		browser.initialFormPage.section.form.section.hiddenrelationshipList.section.fieldA
			.expect.element('@label').to.not.be.visible;

		browser.initialFormPage.cancel();

	}
};
