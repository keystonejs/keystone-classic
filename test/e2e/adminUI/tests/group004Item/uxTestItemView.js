// TODO:  Currently the tests here only fill in the name field of the user list form.  That's because the other
//		  fields in the user list do not have corresponding page object support, yet.  When they do revisit filling
//		  all the fields.
var UserModelTestConfig = require('../../../modelTestConfig/UserModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISignin = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();
		browser.adminUIResetConfirmationScreen = browser.page.adminUIResetConfirmation();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISignin.signin();

		browser.adminUIApp
			.waitForHomeScreen()
			.click('@accessMenu')
			.waitForListScreen();

		browser.adminUIListScreen.click('@secondItemLink');

		browser.adminUIApp.waitForItemScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Item screen should allow creating an item of the same type': function (browser) {
		browser.adminUIItemScreen.new();

		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

	},
	'Item screen should allow saving an item without changes': function (browser) {
		browser.adminUIItemScreen.save();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow saving an item with changes': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			}
		});
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
	},
	'Item screen should allow resetting an item with changes': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			}
		});
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 3', lastName: 'Last 3'},
			}
		});

		browser.adminUIItemScreen.reset();
		browser.adminUIApp.waitForResetConfirmationScreen();
		browser.adminUIResetConfirmationScreen.reset();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: UserModelTestConfig,
			fields: {
				'name': {firstName: 'First 2', lastName: 'Last 2'},
			}
		});
	},
	'Item screen should allow deleting an item': function (browser) {
		browser.adminUIItemScreen.delete();
		browser.adminUIApp.waitForDeleteConfirmationScreen();
		browser.adminUIDeleteConfirmation.delete();
		browser.adminUIApp.waitForListScreen();
	},
};
