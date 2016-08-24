var fieldTests = require('./commonFieldTestUtils.js');
var BooleanModelTestConfig = require('../../../modelTestConfig/BooleanModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Boolean field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Boolean');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: BooleanModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
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
			modelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldD': {value: 'Test'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		})
	},
	'Boolean field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: BooleanModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Boolean field should have its default value if hidden': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: BooleanModelTestConfig,
			fields: [{name: 'fieldD'}],
		});
	},
	'Boolean field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: BooleanModelTestConfig,
			fields: {
				'fieldB': {value: 'false'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: BooleanModelTestConfig,
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldB': {value: 'false'}
			}
		})
	},
};
