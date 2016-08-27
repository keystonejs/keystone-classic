var fieldTests = require('./commonFieldTestUtils.js');
var TextArrayModelTestConfig = require('../../../modelTestConfig/TextArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'TextArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('TextArray');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'TextArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('TextArray');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		})
	},
	'TextArray field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
		browser.itemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'textInputs': ['text1']}
			}],
		});
		browser.itemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'textInputs': ['text1', 'text2']}
			}],
		});
		browser.itemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.itemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{
				name: 'fieldB',
				options:{'textInputs': ['text1', 'text2']}
			}],
		});
	},
	'TextArray field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'}
			}
		});
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'},
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'},
			}
		})
	},
};
