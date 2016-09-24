module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Demonstrate issue 2382': function(browser) {

		// Add new text item

		browser.adminUIApp.openList({section: 'fields', list: 'Text'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.click('@homeIconLink');
		browser.adminUIApp.waitForHomeScreen();

		// Add new relationship with the above text item

		browser.adminUIApp.openList({section: 'Miscs', list: 'ManyRelationship'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'ManyRelationship',
			fields: {
				'name': {value: 'Test 1'},
				'fieldA': {value: 'Test 1'}
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.click('@homeIconLink');
		browser.adminUIApp.waitForHomeScreen();

		// Now delete the text item

		browser.adminUIApp.openList({section: 'fields', list: 'Text'});
		browser.adminUIApp.waitForListScreen();


		browser.adminUIListScreen.navigateToFirstItem();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.delete();

		browser.adminUIDeleteConfirmation
			.waitForElementVisible('@deleteButton');

		browser.adminUIDeleteConfirmation
			.click('@deleteButton');

		browser.adminUIApp.click('@homeIconLink');
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIApp.openList({section: 'Miscs', list: 'ManyRelationship'});
		browser.adminUIListScreen.navigateToFirstItem();

		// TODO since we've not established the intended behaviour yet, just pause.
		// Currently, a blank box appears.
		browser.pause(100000);

	}
};
