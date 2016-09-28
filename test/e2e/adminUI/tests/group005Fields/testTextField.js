var fieldTests = require('./commonFieldTestUtils.js');
var TextModelTestConfig = require('../../../modelTestConfig/TextModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Text field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Text'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: TextModelTestConfig, },
			{ name: 'fieldA', modelTestConfig: TextModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Text field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Text'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Text Field Test 1' }, modelTestConfig: TextModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Text Field Test 1' }, modelTestConfig: TextModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextModelTestConfig },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Text field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', modelTestConfig: TextModelTestConfig, },
			{ name: 'fieldB', modelTestConfig: TextModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Text Field Test 1' }, modelTestConfig: TextModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextModelTestConfig },
		])
	},
	'Text field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'Some test text for field B' }, modelTestConfig: TextModelTestConfig },
		]);
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Text Field Test 1' }, modelTestConfig: TextModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextModelTestConfig },
			{ name: 'fieldB', input: { value: 'Some test text for field B' }, modelTestConfig: TextModelTestConfig },
		])
	},
};
