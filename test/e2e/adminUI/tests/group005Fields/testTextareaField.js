var fieldTests = require('./commonFieldTestUtils.js');
var TextareaModelTestConfig = require('../../../modelTestConfig/TextareaModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Textarea'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: TextareaModelTestConfig, },
			{ name: 'fieldA', modelTestConfig: TextareaModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Textarea field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Textarea'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Textarea Field Test 1' }, modelTestConfig: TextareaModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextareaModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Textarea Field Test 1' }, modelTestConfig: TextareaModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextareaModelTestConfig },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Textarea field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', modelTestConfig: TextareaModelTestConfig, },
			{ name: 'fieldB', modelTestConfig: TextareaModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Textarea Field Test 1' }, modelTestConfig: TextareaModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextareaModelTestConfig },
		])
	},
	'Textarea field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'Some test text for field B' }, modelTestConfig: TextareaModelTestConfig },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Textarea Field Test 1' }, modelTestConfig: TextareaModelTestConfig },
			{ name: 'fieldA', input: { value: 'Some test text for field A' }, modelTestConfig: TextareaModelTestConfig },
			{ name: 'fieldB', input: { value: 'Some test text for field B' }, modelTestConfig: TextareaModelTestConfig },
		])
	},
};
