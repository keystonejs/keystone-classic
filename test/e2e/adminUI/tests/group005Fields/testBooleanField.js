var fieldTests = require('./commonFieldTestUtils.js');
var BooleanModelTestConfig = require('../../../modelTestConfig/booleanModel');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Boolean field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Boolean');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			listModelTestConfig: BooleanModelTestConfig,
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Boolean field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Boolean');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listModelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldD': {value: 'Test'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listModelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listModelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		})
	},
	'Boolean field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			listModelTestConfig: BooleanModelTestConfig,
			fields: ['fieldA', 'fieldB']
		});
	},
	'Boolean field should have its default value if hidden': function(browser) {
		browser.itemScreen.assertUIVisible({
			listModelTestConfig: BooleanModelTestConfig,
			fields: ['fieldD'],
		});
	},
	'Boolean field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listModelTestConfig: BooleanModelTestConfig,
			fields: {
				'fieldB': {value: 'false'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listModelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldB': {value: 'false'}
			}
		})
	},
};
