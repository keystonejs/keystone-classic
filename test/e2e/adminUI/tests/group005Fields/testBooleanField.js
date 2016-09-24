var fieldTests = require('./commonFieldTestUtils.js');
var BooleanModelTestConfig = require('../../../modelTestConfig/BooleanModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Boolean field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'boolean'});
		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: BooleanModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: BooleanModelTestConfig, },
		]);
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Boolean field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'boolean'});

		browser.adminUIListScreen.clickCreateItemButton();

		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Boolean Field Test 1' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldA', input: { value: 'true' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldD', input: { value: 'Test' }, modelTestConfig: BooleanModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Boolean Field Test 1' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldA', input: { value: 'true' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldD', input: { value: 'Test' }, modelTestConfig: BooleanModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Boolean Field Test 1' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldA', input: { value: 'true' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldD', input: { value: 'Test' }, modelTestConfig: BooleanModelTestConfig, },
		]);
	},
	'Boolean field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', modelTestConfig: BooleanModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: BooleanModelTestConfig, },
		]);
	},
	'Boolean field should have its default value if hidden': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldD', modelTestConfig: BooleanModelTestConfig, },
		]);
	},
	'Boolean field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: {value: 'false'}, modelTestConfig: BooleanModelTestConfig, }
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Boolean Field Test 1' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldA', input: { value: 'true' }, modelTestConfig: BooleanModelTestConfig, },
			{ name: 'fieldB', input: { value: 'false' }, modelTestConfig: BooleanModelTestConfig, },
		])
	},
};
