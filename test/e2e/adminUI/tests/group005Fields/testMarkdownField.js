var fieldTests = require('./commonFieldTestUtils.js');
var MarkdownModelTestConfig = require('../../../modelTestConfig/MarkdownModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Markdown field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Markdown');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: MarkdownModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Markdown field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Markdown');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.initialFormScreen.clickUI({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'fieldA': {'click': 'previewToggle'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		})
	},
	'Markdown field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: MarkdownModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Markdown field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: MarkdownModelTestConfig,
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		/* TODO Work out why this was breaking travis, and re-implement
		See https://travis-ci.org/keystonejs/keystone/builds/130040822#L2215
		browser.itemScreen.section.form.section.markdownList.section.fieldA.togglePreview();
		browser.itemScreen.section.form.section.markdownList.section.fieldB.togglePreview();
		browser.itemScreen.assertInputs({
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
