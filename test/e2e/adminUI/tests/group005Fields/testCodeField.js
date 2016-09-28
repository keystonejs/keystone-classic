var fieldTests = require('./commonFieldTestUtils.js');
var CodeModelTestConfig = require('../../../modelTestConfig/CodeModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Code field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Code'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: CodeModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: CodeModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Code field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Code'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Code Field Test 1' }, modelTestConfig: CodeModelTestConfig, },
			{ name: 'fieldA', input: { value: 'Some test code for field A' }, modelTestConfig: CodeModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Code Field Test 1' }, modelTestConfig: CodeModelTestConfig, },
			{ name: 'fieldA', input: { value: 'Some test code for field A' }, modelTestConfig: CodeModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Code field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: CodeModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: CodeModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: CodeModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Code Field Test 1' }, modelTestConfig: CodeModelTestConfig, },
			{ name: 'fieldA', input: { value: 'Some test code for field A' }, modelTestConfig: CodeModelTestConfig, },
		]);
	},
	'Code field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'Some test code for field B' }, modelTestConfig: CodeModelTestConfig, },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Code Field Test 1' }, modelTestConfig: CodeModelTestConfig, },
			{ name: 'fieldA', input: { value: 'Some test code for field A' }, modelTestConfig: CodeModelTestConfig, },
			{ name: 'fieldB', input: { value: 'Some test code for field B' }, modelTestConfig: CodeModelTestConfig, },
		]);
	},
	'restoring test state': function(browser) {
	},
};
