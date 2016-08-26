var fieldTests = require('./commonFieldTestUtils.js');
var NumberModelTestConfig = require('../../../modelTestConfig/NumberModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Number field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Number');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: NumberModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Number field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Number');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: NumberModelTestConfig,
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: NumberModelTestConfig,
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: NumberModelTestConfig,
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
			}
		})
	},
	'Number field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: NumberModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Number field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: NumberModelTestConfig,
			fields: {
				'fieldB': {value: '2'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: NumberModelTestConfig,
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
				'fieldB': {value: '2'}
			}
		})
	},
};
