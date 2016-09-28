var fieldTests = require('./commonFieldTestUtils.js');
var CloudinaryImageMultipleModelTestConfig = require('../../../modelTestConfig/CloudinaryImageMultipleModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImageMultiple field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'CloudinaryImageMultiple'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: CloudinaryImageMultipleModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'CloudinaryImageMultiple field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'CloudinaryImageMultiple'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'CloudinaryImageMultiple Field Test 1' }, modelTestConfig: CloudinaryImageMultipleModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'CloudinaryImageMultiple Field Test 1' }, modelTestConfig: CloudinaryImageMultipleModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'CloudinaryImageMultiple field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: CloudinaryImageMultipleModelTestConfig, },
			{ name: 'fieldA', modelTestConfig: CloudinaryImageMultipleModelTestConfig, },
			{ name: 'fieldB', modelTestConfig: CloudinaryImageMultipleModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'CloudinaryImageMultiple Field Test 1' }, modelTestConfig: CloudinaryImageMultipleModelTestConfig, },
		]);
	},
};
