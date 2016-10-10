var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/NumberArrayModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'NumberArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'NumberArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'NumberArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'NumberArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' },},
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' },},
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'NumberArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA',},
			{ name: 'fieldB',},
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' },},
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'addButton',},
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { 'numberInputs': ['number1'] },},
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'addButton',},
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { 'numberInputs': ['number1', 'number2'] },},
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', click: 'addButton',},
			{ name: 'fieldB', click: 'addButton',},
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldB', options: { 'numberInputs': ['number1', 'number2'] },},
		]);
	},
	'NumberArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldA', input: { number1: '1', number2: '2' },},
		]);
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { number1: '3', number2: '4' },},
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals('flashMessage', 'Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'NumberArray Field Test 1' },},
			{ name: 'fieldA', input: { number1: '1', number2: '2' },},
			{ name: 'fieldB', input: { number1: '3', number2: '4' },},
		]);
	},
};
