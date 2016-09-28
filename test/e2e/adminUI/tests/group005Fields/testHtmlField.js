var fieldTests = require('./commonFieldTestUtils.js');
var HtmlModelTestConfig = require('../../../modelTestConfig/HtmlModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Html'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: HtmlModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Html field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Html'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Html Field Test 1' }, modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'Some test html code for field A' }, modelTestConfig: HtmlModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Html Field Test 1' }, modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'Some test html code for field A' }, modelTestConfig: HtmlModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Html field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: HtmlModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Html Field Test 1' }, modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'Some test html code for field A' }, modelTestConfig: HtmlModelTestConfig, }, 
		]);
	},
	'Html field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'Some test html code for field B' }, modelTestConfig: HtmlModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Html Field Test 1' }, modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'Some test html code for field A' }, modelTestConfig: HtmlModelTestConfig, }, 
			{ name: 'fieldB', input: { value: 'Some test html code for field B' }, modelTestConfig: HtmlModelTestConfig, }, 
		]);
	},
};
