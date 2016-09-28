var fieldTests = require('./commonFieldTestUtils.js');
var CloudinaryImageModelTestConfig = require('../../../modelTestConfig/CloudinaryImageModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImage field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'CloudinaryImage'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: CloudinaryImageModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'CloudinaryImage field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'CloudinaryImage'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'CloudinaryImage Field Test 1' }, modelTestConfig: CloudinaryImageModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'CloudinaryImage Field Test 1' }, modelTestConfig: CloudinaryImageModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

	},
	'CloudinaryImage field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: CloudinaryImageModelTestConfig, },
			{ name: 'fieldA', modelTestConfig: CloudinaryImageModelTestConfig, },
			{ name: 'fieldB', modelTestConfig: CloudinaryImageModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'CloudinaryImage Field Test 1' }, modelTestConfig: CloudinaryImageModelTestConfig, },
		]);
	},
};
