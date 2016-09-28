var fieldTests = require('./commonFieldTestUtils.js');
var PasswordModelTestConfig = require('../../../modelTestConfig/PasswordModelTestConfig');

module.exports = {
	// '@disabled': true,  // TODO: enable after https://github.com/keystonejs/keystone/issues/3428 is fixed
	before: fieldTests.before,
	after: fieldTests.after,
	'Password field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Password'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: PasswordModelTestConfig, },
			{ name: 'fieldA', options: { passwordShown: true },  modelTestConfig: PasswordModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Password field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Password'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Password Field Test 1' }, modelTestConfig: PasswordModelTestConfig },
			{ name: 'fieldA', input: {value: 'password1', confirm: 'wrongPassword1'}, modelTestConfig: PasswordModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.save();
		browser.adminUIInitialFormScreen.assertFlashError("Passwords must match");
		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'fieldA', input: {value: 'password1', confirm: 'password1'}, modelTestConfig: PasswordModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'fieldA', input: {value: 'password1', confirm: 'password1'}, modelTestConfig: PasswordModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Password field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { passwordShown: false },  modelTestConfig: PasswordModelTestConfig, },
			{ name: 'fieldB', options: { passwordShown: false },  modelTestConfig: PasswordModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Password Field Test 1' }, modelTestConfig: PasswordModelTestConfig },
		])
	},
	'Password field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', 'click': 'setPasswordButton', modelTestConfig: PasswordModelTestConfig },
		]);
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { passwordShown: false },  modelTestConfig: PasswordModelTestConfig, },
			{ name: 'fieldB', options: { passwordShown: true },  modelTestConfig: PasswordModelTestConfig, }
		]);
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: {value: 'password2', confirm: 'wrongPassword2'}, modelTestConfig: PasswordModelTestConfig },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashError('Passwords must match');

		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: {value: 'password2', confirm: 'password2'}, modelTestConfig: PasswordModelTestConfig },
		]);
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Password Field Test 1' }, modelTestConfig: PasswordModelTestConfig },
		])
	},
};
