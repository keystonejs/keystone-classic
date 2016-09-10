var fieldTests = require('./commonFieldTestUtils.js');
var MarkdownModelTestConfig = require('../../../modelTestConfig/MarkdownModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Markdown field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Markdown'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: MarkdownModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Markdown field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Markdown'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.adminUIInitialFormScreen.clickFieldUI({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'fieldA': {'click': 'previewToggle'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		})
	},
	'Markdown field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: MarkdownModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Markdown field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		/* TODO Work out why this was breaking travis, and re-implement
		See https://travis-ci.org/keystonejs/keystone/builds/130040822#L2215
		browser.adminUIItemScreen.section.form.section.markdownList.section.fieldA.togglePreview();
		browser.adminUIItemScreen.section.form.section.markdownList.section.fieldB.togglePreview();
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'},
				'fieldB': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'}
			}
		});
		*/
	},
};
