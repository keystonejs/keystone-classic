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
	'Should be able to create an inline relationship': function(browser) {
		// Create items
		browser.app.openMiscList('InlineRelationship');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.save();

		browser.app.waitForItemScreen();
		browser.itemScreen.assertUI({
			listName: 'Relationship',
			fields: ['fieldA']
		});

		// TODO: test button and create form

	}
};
