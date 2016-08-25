var fieldTests = require('./commonFieldTestUtils.js');
var NumberArrayModelTestConfig = require('../../../modelTestConfig/NumberArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'NumberArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('NumberArray');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'NumberArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('NumberArray');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		})
	},
	'NumberArray field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
		browser.itemScreen.clickUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.itemScreen.assertUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'numberInputs': ['number1']}
			}],
		});
		browser.itemScreen.clickUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.itemScreen.assertUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'numberInputs': ['number1', 'number2']}
			}],
		});
		browser.itemScreen.clickUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.itemScreen.clickUI({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.itemScreen.assertUIVisible({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: [{
				name: 'fieldB',
				options:{'numberInputs': ['number1', 'number2']}
			}],
		});
	},
	'NumberArray field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldA': {number1: '1', number2: '2'}
			}
		});
		browser.itemScreen.fillInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'fieldB': {number1: '3', number2: '4'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: NumberArrayModelTestConfig,
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
				'fieldA': {number1: '1', number2: '2'},
				'fieldB': {number1: '3', number2: '4'},
			}
		})
	},
};
