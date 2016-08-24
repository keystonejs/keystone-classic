module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.app.gotoHomeScreen();
		browser.app.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 2382': function(browser) {

		// Add new text item

		browser.app.openFieldList('Text');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.app.click('@homeIconLink');
		browser.app.waitForHomeScreen();

		// Add new relationship with the above text item

		browser.app.openMiscList('ManyRelationship');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'ManyRelationship',
			fields: {
				'name': {value: 'Test 1'},
				'fieldA': {value: 'Test 1'}
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.app.click('@homeIconLink');
		browser.app.waitForHomeScreen();

		// Now delete the text item

		browser.app.openFieldList('Text');
		browser.app.waitForListScreen();


		browser.listScreen.navigateToFirstItem();
		browser.app.waitForItemScreen();
		browser.itemScreen.delete();

		browser.deleteConfirmationScreen
			.waitForElementVisible('@deleteButton');

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.app.click('@homeIconLink');
		browser.app.waitForHomeScreen();

		browser.app.openMiscList('ManyRelationship');
		browser.listScreen.navigateToFirstItem();

		// TODO since we've not established the intended behaviour yet, just pause.
		// Currently, a blank box appears.
		browser.pause(100000);

	}
};
