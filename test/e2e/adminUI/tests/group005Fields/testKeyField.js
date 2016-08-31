var fieldTests = require('./commonFieldTestUtils.js');
var KeyModelTestConfig = require('../../../modelTestConfig/KeyModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Key field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Key'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: KeyModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Key field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Key'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
			}
		})
	},
	'Key field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: KeyModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Key field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'fieldB': {value: 'A test key for field B'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: KeyModelTestConfig,
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
				'fieldB': {value: 'a-test-key-for-field-b'}
			}
		})
	},
};
