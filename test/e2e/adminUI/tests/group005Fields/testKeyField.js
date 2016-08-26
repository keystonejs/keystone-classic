var fieldTests = require('./commonFieldTestUtils.js');
var KeyModelTestConfig = require('../../../modelTestConfig/KeyModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Key field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Key');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: KeyModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Key field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Key');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
			}
		})
	},
	'Key field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: KeyModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Key field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'fieldB': {value: 'A test key for field B'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
				'fieldB': {value: 'a-test-key-for-field-b'}
			}
		})
	},
};
