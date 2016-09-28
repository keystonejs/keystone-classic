var fieldTests = require('./commonFieldTestUtils.js');
var KeyModelTestConfig = require('../../../modelTestConfig/KeyModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Key field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Key'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: KeyModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Key field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Key'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Key Field Test 1' }, modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'A test key for field A' }, modelTestConfig: KeyModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Key Field Test 1' }, modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'A test key for field A' }, modelTestConfig: KeyModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Key field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: KeyModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Key Field Test 1' }, modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'a-test-key-for-field-a' }, modelTestConfig: KeyModelTestConfig, }, 
		]);
	},
	'Key field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'A test key for field B' }, modelTestConfig: KeyModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Key Field Test 1' }, modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'a-test-key-for-field-a' }, modelTestConfig: KeyModelTestConfig, }, 
			{ name: 'fieldB', input: { value: 'a-test-key-for-field-b' }, modelTestConfig: KeyModelTestConfig, }, 
		]);
	},
};
