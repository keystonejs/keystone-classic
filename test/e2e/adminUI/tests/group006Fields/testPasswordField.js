var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/PasswordModelTestConfig');

module.exports = {
	// '@disabled': true,  // TODO: enable after https://github.com/keystonejs/keystone/issues/3428 is fixed
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Password field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Password' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', options: { passwordShown: true }, }
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Password field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Password' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Password Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'password1', confirm: 'wrongPassword1' }, },
			],
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIInitialFormScreen.assertElementTextEquals({ element: '@flashError', text: 'Passwords must match' });
		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldA', input: { value: 'password1', confirm: 'password1' }, },
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'fieldA', input: { value: 'password1', confirm: 'password1' }, },
			],
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Password field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { passwordShown: false }, },
				{ name: 'fieldB', options: { passwordShown: false }, }
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Password Field Test 1' }, },
			],
		})
	},
	'Password field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldB', 'click': 'setPasswordButton', },
			],
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { passwordShown: false }, },
				{ name: 'fieldB', options: { passwordShown: true }, }
			],
		});
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: 'password2', confirm: 'wrongPassword2' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashError', text: 'Passwords must match' });

		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: 'password2', confirm: 'password2' }, },
			],
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Password Field Test 1' }, },
			],
		})
	},
};
