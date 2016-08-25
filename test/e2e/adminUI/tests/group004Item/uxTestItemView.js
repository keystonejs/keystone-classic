// TODO:  Currently the tests here only fill in the name field of the user list form.  That's because the other
//		  fields in the user list do not have corresponding page object support, yet.  When they do revisit filling
//		  all the fields.
var UserModelTestConfig = require('../../../modelTestConfig/UserModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();
		browser.resetConfirmationScreen = browser.page.resetConfirmation();

		browser.adminUIApp
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.adminUIApp
			.waitForHomeScreen()
			.click('@accessMenu')
			.waitForListScreen();

		browser.listScreen.click('@secondItemLink');

		browser.adminUIApp.waitForItemScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Item screen should allow creating an item of the same type': function (browser) {
		browser.itemScreen.new();

		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});

		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

	},
	'Item screen should allow saving an item without changes': function (browser) {
		browser.itemScreen.save();

		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow saving an item with changes': function (browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			}
		});
		browser.itemScreen.assertInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow resetting an item with changes': function (browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			}
		});
		browser.itemScreen.assertInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			}
		});

		browser.itemScreen.reset();
		browser.adminUIApp.waitForResetConfirmationScreen();
		browser.resetConfirmationScreen.reset();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			}
		});
	},
	'Item screen should allow deleting an item': function (browser) {
		browser.itemScreen.delete();
		browser.adminUIApp.waitForDeleteConfirmationScreen();
		browser.deleteConfirmationScreen.delete();
		browser.adminUIApp.waitForListScreen();
	},
};
