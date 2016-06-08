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
	'Demonstrate issue 2946': function(browser) {
		// Create items
		browser.app.openMiscList('HiddenBoolean');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();


		// Issue demonstation - the (hidden) boolean field (fieldA) defaults to true
		// This means that fieldB, which depends on the boolean being true shows here.
		browser.initialFormPage.fillInputs({
			listName: 'HiddenBoolean',
			fields: {
				'fieldB': {value: 'Test'},
			},
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		// The boolean field should still be true, meaning that fieldB should be visible.
		// In fact, the boolean has been set to false on save, as per issue 2946.
		browser.itemPage.assertUI({
			listName: 'HiddenBoolean',
			fields: ['fieldB'],
		});


	}
};
