var fieldTests = require('./commonFieldTestUtils.js');
var NumberModelTestConfig = require('../../../modelTestConfig/NumberModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Number field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Number'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: NumberModelTestConfig, },
			{ name: 'fieldA', modelTestConfig: NumberModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Number field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Number'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Number Field Test 1' }, modelTestConfig: NumberModelTestConfig },
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: NumberModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Number Field Test 1' }, modelTestConfig: NumberModelTestConfig },
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: NumberModelTestConfig },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Number field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', modelTestConfig: NumberModelTestConfig, },
			{ name: 'fieldB', modelTestConfig: NumberModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Number Field Test 1' }, modelTestConfig: NumberModelTestConfig },
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: NumberModelTestConfig },
		])
	},
	'Number field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: '2' }, modelTestConfig: NumberModelTestConfig },
		]);
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Number Field Test 1' }, modelTestConfig: NumberModelTestConfig },
			{ name: 'fieldA', input: { value: '1' }, modelTestConfig: NumberModelTestConfig },
			{ name: 'fieldB', input: { value: '2' }, modelTestConfig: NumberModelTestConfig },
		])
	},
};
