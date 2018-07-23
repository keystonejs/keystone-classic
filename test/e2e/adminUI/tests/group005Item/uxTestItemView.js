// TODO:  Currently the tests here only fill in the name field of the user list form.  That's because the other
//		  fields in the user list do not have corresponding page object support, yet.  When they do revisit filling
//		  all the fields.
var ModelTestConfig = require('../../../modelTestConfig/UserModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();
		browser.adminUIResetConfirmationScreen = browser.page.adminUIResetConfirmation();

		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);

		browser.adminUIApp.gotoSigninScreen();

		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();

		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIApp.openList({ section: 'access', list: 'User' });

		browser.adminUIListScreen.clickItemFieldValue({
			fields: [
				{ row: 2, column: 2, name: 'name', }
			],
		});

		browser.adminUIApp.waitForItemScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Item screen should allow saving an item without changes': function (browser) {
		browser.adminUIItemScreen.save();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });
	},
	'Item screen should allow saving an item with changes': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { firstName: 'First 2', lastName: 'Last 2' }, },
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { firstName: 'First 2', lastName: 'Last 2' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });
	},
	'Item screen should allow resetting an item with changes': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { firstName: 'First 3', lastName: 'Last 3' }, },
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { firstName: 'First 3', lastName: 'Last 3' }, },
			],
		});

		browser.adminUIItemScreen.reset();
		browser.adminUIApp.waitForResetConfirmationScreen();
		browser.adminUIResetConfirmationScreen.reset();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { firstName: 'First 2', lastName: 'Last 2' }, },
			],
		});
	},
};
