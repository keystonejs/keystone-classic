var fieldTests = require('./commonFieldTestUtils.js');
var MoneyModelTestConfig = require('../../../modelTestConfig/MoneyModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Money field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Money'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: MoneyModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Money field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Money'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Money Field Test 1' }, modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: MoneyModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Money Field Test 1' }, modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: MoneyModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Money field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: MoneyModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Money Field Test 1' }, modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: MoneyModelTestConfig, }, 
		]);
	},
	'Money field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: '2' }, modelTestConfig: MoneyModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Money Field Test 1' }, modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: MoneyModelTestConfig, }, 
			{ name: 'fieldB', input: { value: '2' }, modelTestConfig: MoneyModelTestConfig, }, 
		]);
	},
};
