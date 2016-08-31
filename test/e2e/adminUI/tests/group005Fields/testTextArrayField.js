var fieldTests = require('./commonFieldTestUtils.js');
var TextArrayModelTestConfig = require('../../../modelTestConfig/TextArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'TextArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'TextArray'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'TextArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'TextArray'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		})
	},
	'TextArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'textInputs': ['text1']}
			}],
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'textInputs': ['text1', 'text2']}
			}],
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: TextArrayModelTestConfig,
			fields: [{
				name: 'fieldB',
				options:{'textInputs': ['text1', 'text2']}
			}],
		});
	},
	'TextArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'}
			}
		});
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: TextArrayModelTestConfig,
			fields: {
				'name': {value: 'TextArray Field Test 1'},
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'},
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'},
			}
		})
	},
};
