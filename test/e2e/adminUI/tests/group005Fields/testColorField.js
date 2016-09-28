var fieldTests = require('./commonFieldTestUtils.js');
var ColorModelTestConfig = require('../../../modelTestConfig/ColorModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Color field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Color'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: ColorModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: ColorModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Color field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Color'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Color Field Test 1' }, modelTestConfig: ColorModelTestConfig, },
			{ name: 'fieldA', input: { value: '#002147' }, modelTestConfig: ColorModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Color Field Test 1' }, modelTestConfig: ColorModelTestConfig, },
			{ name: 'fieldA', input: { value: '#002147' }, modelTestConfig: ColorModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Color field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: ColorModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: ColorModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: ColorModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Color Field Test 1' }, modelTestConfig: ColorModelTestConfig, },
			{ name: 'fieldA', input: { value: '#002147' }, modelTestConfig: ColorModelTestConfig, },
		]);
	},
	'Color field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: '#f8e71c' }, modelTestConfig: ColorModelTestConfig, },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Color Field Test 1' }, modelTestConfig: ColorModelTestConfig, },
			{ name: 'fieldA', input: { value: '#002147' }, modelTestConfig: ColorModelTestConfig, },
			{ name: 'fieldB', input: { value: '#f8e71c' }, modelTestConfig: ColorModelTestConfig, },
		]);
	},
};
