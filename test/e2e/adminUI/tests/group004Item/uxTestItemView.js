// TODO:  Currently the tests here only fill in the name field of the user list form.  That's because the other
//		  fields in the user list do not have corresponding page object support, yet.  When they do revisit filling
//		  all the fields.
module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();
		browser.resetConfirmationScreen = browser.page.resetConfirmation();

		browser.app
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.app
			.waitForHomeScreen()
			.click('@accessMenu')
			.waitForListScreen();

		browser.listScreen.click('@secondItemLink');

		browser.app.waitForItemScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Item screen should allow creating an item of the same type': function (browser) {
		browser.itemScreen.new();

		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			},
		});
		browser.initialFormScreen.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			},
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

	},
	'Item screen should allow saving an item without changes': function (browser) {
		browser.itemScreen.save();

		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow saving an item with changes': function (browser) {
		browser.itemScreen.fillInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			},
		});
		browser.itemScreen.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			},
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow resetting an item with changes': function (browser) {
		browser.itemScreen.fillInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			},
		});
		browser.itemScreen.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			},
		});

		browser.itemScreen.reset();
		browser.app.waitForResetConfirmationScreen();
		browser.resetConfirmationScreen.reset();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'User',
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			},
		});
	},
	'Item screen should allow deleting an item': function (browser) {
		browser.itemScreen.delete();
		browser.app.waitForDeleteConfirmationScreen();
		browser.deleteConfirmationScreen.delete();
		browser.app.waitForListScreen();
	},
};
