var fieldTests = require('./commonFieldTestUtils.js');
var FileModelTestConfig = require('../../../modelTestConfig/FileModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'File field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'File'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: FileModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'File field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'File'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'File Field Test 1' }, modelTestConfig: FileModelTestConfig, }, 
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'File Field Test 1' }, modelTestConfig: FileModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'File field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: FileModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: FileModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: FileModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'File Field Test 1' }, modelTestConfig: FileModelTestConfig, }, 
		]);
	},
};
