var fieldTests = require('./commonFieldTestUtils.js');
var UrlModelTestConfig = require('../../../modelTestConfig/UrlModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Url field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Url'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: UrlModelTestConfig, },
			{ name: 'fieldA', modelTestConfig: UrlModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Url field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Url'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Url Field Test 1' }, modelTestConfig: UrlModelTestConfig },
			{ name: 'fieldA', input: { value: 'http://www.example1.com' }, modelTestConfig: UrlModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Url Field Test 1' }, modelTestConfig: UrlModelTestConfig },
			{ name: 'fieldA', input: { value: 'http://www.example1.com' }, modelTestConfig: UrlModelTestConfig },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Url field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', modelTestConfig: UrlModelTestConfig, },
			{ name: 'fieldB', modelTestConfig: UrlModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Url Field Test 1' }, modelTestConfig: UrlModelTestConfig },
			{ name: 'fieldA', input: { value: 'http://www.example1.com' }, modelTestConfig: UrlModelTestConfig },
		])
	},
	'Url field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'http://www.example2.com' }, modelTestConfig: UrlModelTestConfig },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Url Field Test 1' }, modelTestConfig: UrlModelTestConfig },
			{ name: 'fieldA', input: { value: 'http://www.example1.com' }, modelTestConfig: UrlModelTestConfig },
			{ name: 'fieldB', input: { value: 'http://www.example2.com' }, modelTestConfig: UrlModelTestConfig },
		])
	},
};
