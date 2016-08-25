module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Demonstrate issue 2382': function(browser) {

		// Add new text item

		browser.adminUIApp.openFieldList('Text');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.click('@homeIconLink');
		browser.adminUIApp.waitForHomeScreen();

		// Add new relationship with the above text item

		browser.adminUIApp.openMiscList('ManyRelationship');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'ManyRelationship',
			fields: {
				'name': {value: 'Test 1'},
				'fieldA': {value: 'Test 1'}
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.click('@homeIconLink');
		browser.adminUIApp.waitForHomeScreen();

		// Now delete the text item

		browser.adminUIApp.openFieldList('Text');
		browser.adminUIApp.waitForListScreen();


		browser.listScreen.navigateToFirstItem();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.delete();

		browser.deleteConfirmationScreen
			.waitForElementVisible('@deleteButton');

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.adminUIApp.click('@homeIconLink');
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIApp.openMiscList('ManyRelationship');
		browser.listScreen.navigateToFirstItem();

		// TODO since we've not established the intended behaviour yet, just pause.
		// Currently, a blank box appears.
		browser.pause(100000);

	}
};
