var fieldTests = require('./commonFieldTestUtils.js');
var NumberArrayModelTestConfig = require('../../../modelTestConfig/NumberArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'NumberArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'NumberArray'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'NumberArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'NumberArray'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		})
	},
	'NumberArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'numberInputs': ['number1']}
			}],
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'numberInputs': ['number1', 'number2']}
			}],
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{
				name: 'fieldB',
				options:{'numberInputs': ['number1', 'number2']}
			}],
		});
	},
	'NumberArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldA': {number1: '1', number2: '2'}
			}
		});
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldB': {number1: '3', number2: '4'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
				'fieldA': {number1: '1', number2: '2'},
				'fieldB': {number1: '3', number2: '4'},
			}
		})
	},
};
