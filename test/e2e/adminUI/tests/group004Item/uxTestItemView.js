// TODO:  Currently the tests here only fill in the name field of the user list form.  That's because the other
//		  fields in the user list do not have corresponding page object support, yet.  When they do revisit filling
//		  all the fields.
module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();
		browser.deleteConfirmationPage = browser.page.deleteConfirmation();
		browser.resetConfirmationPage = browser.page.resetConfirmation();

		browser.app.navigate();

		browser.app.waitForSigninScreen();

		browser.signinPage.signin();

		browser.app.waitForElementVisible('@homeScreen');

		browser.app.click('@accessMenu').waitForListScreen();

		browser.listPage.click('@secondItemLink');

		browser.app.waitForItemScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Item screen should allow creating an item of the same type': function (browser) {
		browser.itemPage.new();

		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.fillInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			},
		});
		browser.initialFormPage.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			},
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

	},
	'Item screen should allow saving an item without changes': function (browser) {
		browser.itemPage.save();

		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow saving an item with changes': function (browser) {
		browser.itemPage.fillInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			},
		});
		browser.itemPage.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			},
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow resetting an item with changes': function (browser) {
		browser.itemPage.fillInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			},
		});
		browser.itemPage.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			},
		});

		browser.itemPage.reset();
		browser.app.waitForResetConfirmationScreen();
		browser.resetConfirmationPage.reset();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			},
		});
	},
	'Item screen should allow deleting an item': function (browser) {
		browser.itemPage.delete();
		browser.app.waitForDeleteConfirmationScreen();
		browser.deleteConfirmationPage.delete();
		browser.app.waitForListScreen();
	},
};
