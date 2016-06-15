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
	'Should be able to create an inline relationship': function(browser) {
		// Create items
		browser.app.openMiscList('InlineRelationship');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.save();

		browser.app.waitForItemScreen();
		browser.itemPage.assertUI({
			listName: 'Relationship',
			fields: ['fieldA']
		});

		// TODO: test button and create form

	}
};
