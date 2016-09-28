var fieldTests = require('./commonFieldTestUtils.js');
var DateModelTestConfig = require('../../../modelTestConfig/DateModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Date'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: DateModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Date field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Date'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Date Field Test 1' }, modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '2016-01-01' }, modelTestConfig: DateModelTestConfig, }, 
		]);
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Date Field Test 1' }, modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '2016-01-01' }, modelTestConfig: DateModelTestConfig, }, 
		]);
		*/
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Date field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: DateModelTestConfig, }, 
		]);

		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Date Field Test 1' }, modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '2016-01-01' }, modelTestConfig: DateModelTestConfig, }, 
		]);
		*/
	},
	'Date field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: '2016-01-02' }, modelTestConfig: DateModelTestConfig, }, 
		]);

		// Drop focus on the date field so the popup disappears.
		browser.execute(function() {
			document.activeElement.blur();
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Date Field Test 1' }, modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldA', input: { value: '2016-01-01' }, modelTestConfig: DateModelTestConfig, }, 
			{ name: 'fieldB', input: { value: '2016-01-02' }, modelTestConfig: DateModelTestConfig, }, 
		]);
		*/
	},
};
