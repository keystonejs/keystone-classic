var fieldTests = require('./commonFieldTestUtils.js');
var EmailModelTestConfig = require('../../../modelTestConfig/EmailModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Email field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Email'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: EmailModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Email field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Email'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' }, modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'user@example1.com' }, modelTestConfig: EmailModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' }, modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'user@example1.com' }, modelTestConfig: EmailModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Email field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: EmailModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' }, modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'user@example1.com' }, modelTestConfig: EmailModelTestConfig, }, 
		]);
	},
	'Email field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'user@example2.com' }, modelTestConfig: EmailModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' }, modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldA', input: { value: 'user@example1.com' }, modelTestConfig: EmailModelTestConfig, }, 
			{ name: 'fieldB', input: { value: 'user@example2.com' }, modelTestConfig: EmailModelTestConfig, }, 
		]);
	},
};
