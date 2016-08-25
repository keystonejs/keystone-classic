var fieldTests = require('./commonFieldTestUtils.js');
var CodeModelTestConfig = require('../../../modelTestConfig/CodeModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Code field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Code');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: CodeModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Code field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Code');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: CodeModelTestConfig,
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: CodeModelTestConfig,
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: CodeModelTestConfig,
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		})
	},
	'Code field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: CodeModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Code field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: CodeModelTestConfig,
			fields: {
				'fieldB': {value: 'Some test code for field B'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: CodeModelTestConfig,
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
				'fieldB': {value: 'Some test code for field B'}
			}
		})
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
};
