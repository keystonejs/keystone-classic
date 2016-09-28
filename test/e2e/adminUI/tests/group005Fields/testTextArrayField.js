var fieldTests = require('./commonFieldTestUtils.js');
var TextArrayModelTestConfig = require('../../../modelTestConfig/TextArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'TextArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'TextArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: TextArrayModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'TextArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'TextArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'TextArray Field Test 1' }, modelTestConfig: TextArrayModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'TextArray Field Test 1' }, modelTestConfig: TextArrayModelTestConfig },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'TextArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', modelTestConfig: TextArrayModelTestConfig, },
			{ name: 'fieldB', modelTestConfig: TextArrayModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'TextArray Field Test 1' }, modelTestConfig: TextArrayModelTestConfig },
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', 'click': 'addButton', modelTestConfig: TextArrayModelTestConfig },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: {'textInputs': ['text1']}, modelTestConfig: TextArrayModelTestConfig, },
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', 'click': 'addButton', modelTestConfig: TextArrayModelTestConfig },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: {'textInputs': ['text1', 'text2']}, modelTestConfig: TextArrayModelTestConfig, },
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', 'click': 'addButton', modelTestConfig: TextArrayModelTestConfig },
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', 'click': 'addButton', modelTestConfig: TextArrayModelTestConfig },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldB', options: {'textInputs': ['text1', 'text2']}, modelTestConfig: TextArrayModelTestConfig, },
		]);
	},
	'TextArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldA', input: { text1: 'Test text 1', text2: 'Test text 2' }, modelTestConfig: TextArrayModelTestConfig },
			{ name: 'fieldB', input: { text1: 'Test text 3', text2: 'Test text 4' }, modelTestConfig: TextArrayModelTestConfig },
		]);
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'fieldA', input: { text1: 'Test text 1', text2: 'Test text 2' }, modelTestConfig: TextArrayModelTestConfig },
			{ name: 'fieldB', input: { text1: 'Test text 3', text2: 'Test text 4' }, modelTestConfig: TextArrayModelTestConfig },
		])
	},
};
