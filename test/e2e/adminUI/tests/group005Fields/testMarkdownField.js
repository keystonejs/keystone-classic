var fieldTests = require('./commonFieldTestUtils.js');
var MarkdownModelTestConfig = require('../../../modelTestConfig/MarkdownModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Markdown field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Markdown'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: MarkdownModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Markdown field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Markdown'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' }, modelTestConfig: MarkdownModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' }, modelTestConfig: MarkdownModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.clickFieldUI([
			{ name: 'fieldA', click: 'previewToggle', modelTestConfig: MarkdownModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', input: { html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n' }, modelTestConfig: MarkdownModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Markdown field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: MarkdownModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' }, modelTestConfig: MarkdownModelTestConfig, }, 
		]);
	},
	'Markdown field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { md: 'Some __test__ markdown for **field B**' }, modelTestConfig: MarkdownModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', input: { md: 'Some __test__ markdown for **field A**' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldB', input: { md: 'Some __test__ markdown for **field B**' }, modelTestConfig: MarkdownModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'previewToggle', modelTestConfig: MarkdownModelTestConfig, },
			{ name: 'fieldB', click: 'previewToggle', modelTestConfig: MarkdownModelTestConfig, },
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Markdown Field Test 1' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldA', input: { html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n' }, modelTestConfig: MarkdownModelTestConfig, }, 
			{ name: 'fieldB', input: { html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n' }, modelTestConfig: MarkdownModelTestConfig, }, 
		]);
	},
};
