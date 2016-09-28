var fieldTests = require('./commonFieldTestUtils.js');
var NumberArrayModelTestConfig = require('../../../modelTestConfig/NumberArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'NumberArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'NumberArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'NumberArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'NumberArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'NumberArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: NumberArrayModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: NumberArrayModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'addButton', modelTestConfig: NumberArrayModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { 'numberInputs': ['number1'] }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'addButton', modelTestConfig: NumberArrayModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { 'numberInputs': ['number1', 'number2'] }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', click: 'addButton', modelTestConfig: NumberArrayModelTestConfig, },
			{ name: 'fieldB', click: 'addButton', modelTestConfig: NumberArrayModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldB', options: { 'numberInputs': ['number1', 'number2'] }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);
	},
	'NumberArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldA', input: { number1: '1', number2: '2' }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { number1: '3', number2: '4' }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' }, modelTestConfig: NumberArrayModelTestConfig, }, 
			{ name: 'fieldA', input: { number1: '1', number2: '2' }, modelTestConfig: NumberArrayModelTestConfig, }, 
			{ name: 'fieldB', input: { number1: '3', number2: '4' }, modelTestConfig: NumberArrayModelTestConfig, }, 
		]);
	},
};
