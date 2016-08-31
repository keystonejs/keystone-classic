var fieldTests = require('./commonFieldTestUtils.js');
var PasswordModelTestConfig = require('../../../modelTestConfig/PasswordModelTestConfig');

module.exports = {
	'@disabled': true,  // TODO: enable after https://github.com/keystonejs/keystone/issues/3428 is fixed
	before: fieldTests.before,
	after: fieldTests.after,
	'Password field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Password'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: PasswordModelTestConfig,
			fields: [
				{
					name: 'name'
				},
				{
					name: 'fieldA',
					options: {passwordShown: true}, // To check for @value instead of @button
				}
			],
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Password field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Password'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
				'fieldA': {value: 'password1', confirm: 'wrongPassword1'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIInitialFormScreen.assertFlashError("Passwords must match");
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldA': {value: 'password1', confirm: 'password1'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
	'Password field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: PasswordModelTestConfig,
			fields: [
				{
					name: 'fieldA',
					options: {passwordShown: false}, // To check for @button instead of @value
				},
				{
					name: 'fieldB',
					options: {passwordShown: false}, // To check for @button instead of @value
				}
			],
		});
	},
	'Password field can be filled via the edit form': function(browser) {
		browser.itemScreen.clickFieldUI({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldB': {'click': 'setPasswordButton'},
			}
		});
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: PasswordModelTestConfig,
			fields: [
				{
					name: 'fieldA',
					options: {passwordShown: false}, // To check for @button instead of @value
				},
				{
					name: 'fieldB',
					options: {passwordShown: true}, // To check for @value instead of @button
				}
			],
		});
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldB': {value: 'password2', confirm: 'wrongPassword2'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashError('Passwords must match');
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldB': {value: 'password2', confirm: 'password2'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
};
