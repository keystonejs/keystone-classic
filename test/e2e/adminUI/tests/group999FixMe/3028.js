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
	'Should be able to create an inline relationship': function(browser) {
		// Create items
		browser.adminUIApp.openMiscList('InlineRelationship');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.save();

		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertUI({
			listName: 'Relationship',
			fields: ['fieldA']
		});

		// TODO: test button and create form

	}
};
