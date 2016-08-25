var fieldTests = require('./commonFieldTestUtils.js');
var MoneyModelTestConfig = require('../../../modelTestConfig/MoneyModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Money field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Money');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: MoneyModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Money field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Money');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: MoneyModelTestConfig,
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: MoneyModelTestConfig,
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: MoneyModelTestConfig,
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
			}
		})
	},
	'Money field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: MoneyModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Money field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: MoneyModelTestConfig,
			fields: {
				'fieldB': {value: '2'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: MoneyModelTestConfig,
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
				'fieldB': {value: '2'}
			}
		})
	},
};
