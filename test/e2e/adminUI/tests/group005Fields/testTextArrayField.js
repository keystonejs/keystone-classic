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
		browser.adminUIApp.openList({section: 'fields', list: 'TextArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'TextArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'TextArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'TextArray Field Test 1' }, },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'TextArray Field Test 1' }, },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'TextArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA',},
			{ name: 'fieldB',},
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'TextArray Field Test 1' }, },
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', 'click': 'addButton', },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: {'textInputs': ['text1']},},
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', 'click': 'addButton', },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: {'textInputs': ['text1', 'text2']},},
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', 'click': 'addButton', },
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', 'click': 'addButton', },
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldB', options: {'textInputs': ['text1', 'text2']},},
		]);
	},
	'TextArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldA', input: { text1: 'Test text 1', text2: 'Test text 2' }, },
			{ name: 'fieldB', input: { text1: 'Test text 3', text2: 'Test text 4' }, },
		]);
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'fieldA', input: { text1: 'Test text 1', text2: 'Test text 2' }, },
			{ name: 'fieldB', input: { text1: 'Test text 3', text2: 'Test text 4' }, },
		])
	},
};
