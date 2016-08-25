var fieldTests = require('./commonFieldTestUtils.js');
var PasswordModelTestConfig = require('../../../modelTestConfig/PasswordModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Password field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Password');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
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
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Password field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Password');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
				'fieldA': {value: 'password1', confirm: 'wrongPassword1'},
			}
		});
		browser.initialFormScreen.save();
		browser.initialFormScreen.assertFlashError("Passwords must match");
		browser.initialFormScreen.fillInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldA': {value: 'password1', confirm: 'password1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
	'Password field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
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
		browser.itemScreen.clickUI({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldB': {'click': 'setPasswordButton'},
			}
		});
		browser.itemScreen.assertUIVisible({
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
		browser.itemScreen.fillInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldB': {value: 'password2', confirm: 'wrongPassword2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashError('Passwords must match');
		browser.itemScreen.fillInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'fieldB': {value: 'password2', confirm: 'password2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: PasswordModelTestConfig,
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
};
