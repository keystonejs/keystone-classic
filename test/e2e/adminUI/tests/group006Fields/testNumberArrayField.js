var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/NumberArrayModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'NumberArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'NumberArray' });

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
	'NumberArray field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'NumberArray' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'NumberArray Field Test 1' }, },
			],
		});

		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'NumberArray Field Test 1' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'NumberArray field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', },
				{ name: 'fieldB', },
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'NumberArray Field Test 1' }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', click: 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { 'numberInputs': ['number1'] }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', click: 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { 'numberInputs': ['number1', 'number2'] }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldB', click: 'addButton', },
				{ name: 'fieldB', click: 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldB', options: { 'numberInputs': ['number1', 'number2'] }, },
			],
		});
	},
	'NumberArray field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldA', input: { number1: '1', number2: '2' }, },
			],
		});
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { number1: '3', number2: '4' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'NumberArray Field Test 1' }, },
				{ name: 'fieldA', input: { number1: '1', number2: '2' }, },
				{ name: 'fieldB', input: { number1: '3', number2: '4' }, },
			],
		});
	},
};
