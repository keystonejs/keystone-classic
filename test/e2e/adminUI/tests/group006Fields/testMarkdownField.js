var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/MarkdownModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Markdown field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Markdown'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA',},
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Markdown field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Markdown'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' },},
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' },},
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' },},
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' },},
		]);

		browser.adminUIInitialFormScreen.clickFieldUI([
			{ name: 'fieldA', click: 'previewToggle',}
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' },},
			{ name: 'fieldA', input: { html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n' },},
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Markdown field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA',},
			{ name: 'fieldB',},
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' },},
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' },},
		]);
	},
	'Markdown field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { md: 'Some __test__ markdown for **field B**' },},
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals('flashMessage', 'Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' },},
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' },},
			{ name: 'fieldB', input: { md: 'Some __test__ markdown for **field B**' },},
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'previewToggle',},
			{ name: 'fieldB', click: 'previewToggle',},
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' },},
			{ name: 'fieldA', input: { html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n' },},
			{ name: 'fieldB', input: { html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n' },},
		]);
	},
};
