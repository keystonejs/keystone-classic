module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();
		browser.deleteConfirmation = browser.page.deleteConfirmation();

		browser.app.navigate();
		browser.app.waitForSigninScreen();

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 2382': function(browser) {

		// Add new text item

		browser.app.openFieldList('Text');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.fillInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.app.click('@homeIconLink');
		browser.app.waitForHomeScreen();

		// Add new relationship with the above text item

		browser.app.openMiscList('ManyRelationship');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.fillInputs({
			listName: 'ManyRelationship',
			fields: {
				'name': {value: 'Test 1'},
				'fieldA': {value: 'Test 1'}
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.app.click('@homeIconLink');
		browser.app.waitForHomeScreen();

		// Now delete the text item

		browser.app.openFieldList('Text');
		browser.app.waitForListScreen();


		browser.listPage.navigateToFirstItem();
		browser.app.waitForItemScreen();
		browser.itemPage.delete();

		browser.deleteConfirmation
			.waitForElementVisible('@deleteButton');

		browser.deleteConfirmation
			.click('@deleteButton');

		browser.app.click('@homeIconLink');
		browser.app.waitForHomeScreen();

		browser.app.openMiscList('ManyRelationship');
		browser.listPage.navigateToFirstItem();

		// TODO since we've not established the intended behaviour yet, just pause.
		// Currently, a blank box appears.
		browser.pause(100000);

	}
};
