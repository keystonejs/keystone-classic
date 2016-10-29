var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/TextArrayModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'TextArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'TextArray' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'TextArray field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'TextArray' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'TextArray Field Test 1' }, },
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'TextArray Field Test 1' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'TextArray field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', },
				{ name: 'fieldB', },
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'TextArray Field Test 1' }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', 'click': 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { 'textInputs': ['text1'] }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', 'click': 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { 'textInputs': ['text1', 'text2'] }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldB', 'click': 'addButton', },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldB', 'click': 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldB', options: { 'textInputs': ['text1', 'text2'] }, },
			],
		});
	},
	'TextArray field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldA', input: { text1: 'Test text 1', text2: 'Test text 2' }, },
				{ name: 'fieldB', input: { text1: 'Test text 3', text2: 'Test text 4' }, },
			],
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'fieldA', input: { text1: 'Test text 1', text2: 'Test text 2' }, },
				{ name: 'fieldB', input: { text1: 'Test text 3', text2: 'Test text 4' }, },
			],
		})
	},
};
