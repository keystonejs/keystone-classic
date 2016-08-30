var fieldTests = require('./commonFieldTestUtils.js');
var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Name');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: NameModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Name field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Name');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		})
	},
	'Name field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: NameModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Name field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
				'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
			}
		})
	},
};
