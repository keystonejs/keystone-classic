var fieldTests = require('./commonFieldTestUtils.js');
var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: NameModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Name field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Name Field Test 1' }, modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldA', input: { firstName: 'First 1', lastName: 'Last 1' }, modelTestConfig: NameModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Name Field Test 1' }, modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldA', input: { firstName: 'First 1', lastName: 'Last 1' }, modelTestConfig: NameModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Name field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: NameModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Name Field Test 1' }, modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldA', input: { firstName: 'First 1', lastName: 'Last 1' }, modelTestConfig: NameModelTestConfig, }, 
		]);
	},
	'Name field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { firstName: 'First 2', lastName: 'Last 2' }, modelTestConfig: NameModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Name Field Test 1' }, modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldA', input: { firstName: 'First 1', lastName: 'Last 1' }, modelTestConfig: NameModelTestConfig, }, 
			{ name: 'fieldB', input: { firstName: 'First 2', lastName: 'Last 2' }, modelTestConfig: NameModelTestConfig, }, 
		]);
	},
};
