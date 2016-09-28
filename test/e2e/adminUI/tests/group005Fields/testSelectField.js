var fieldTests = require('./commonFieldTestUtils.js');
var SelectModelTestConfig = require('../../../modelTestConfig/SelectModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Select'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: SelectModelTestConfig, },
			{ name: 'fieldA', options: {'placeholder': true}, modelTestConfig: SelectModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Select field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Select'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Select Field Test 1' }, modelTestConfig: SelectModelTestConfig },
			{ name: 'fieldA', input: { value: 'One' }, modelTestConfig: SelectModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Select Field Test 1' }, modelTestConfig: SelectModelTestConfig },
			{ name: 'fieldA', input: { value: 'One' }, modelTestConfig: SelectModelTestConfig },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Select field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: {'placeholder': false}, modelTestConfig: SelectModelTestConfig, },
			{ name: 'fieldB', options: {'placeholder': true}, modelTestConfig: SelectModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Select Field Test 1' }, modelTestConfig: SelectModelTestConfig },
			{ name: 'fieldA', input: { value: 'One' }, modelTestConfig: SelectModelTestConfig },
		])
	},
	'Select field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'Two' }, modelTestConfig: SelectModelTestConfig },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Select Field Test 1' }, modelTestConfig: SelectModelTestConfig },
			{ name: 'fieldA', input: { value: 'One' }, modelTestConfig: SelectModelTestConfig },
			{ name: 'fieldB', input: { value: 'Two' }, modelTestConfig: SelectModelTestConfig },
		])
	},
};
