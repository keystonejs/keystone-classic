var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/SelectModelTestConfig');

module.exports = {
	'@disabled': true,
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Select field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Select' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', options: { 'placeholder': true }, }
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Select field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Select' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Select Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'One' }, },
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Select Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'One' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Select field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { 'placeholder': false }, },
				{ name: 'fieldB', options: { 'placeholder': true }, }
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Select Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'One' }, },
			],
		})
	},
	'Select field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: 'Two' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Select Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'One' }, },
				{ name: 'fieldB', input: { value: 'Two' }, },
			],
		})
	},
};
