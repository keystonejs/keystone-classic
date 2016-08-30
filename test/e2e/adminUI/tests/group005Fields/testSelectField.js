var fieldTests = require('./commonFieldTestUtils.js');
var SelectModelTestConfig = require('../../../modelTestConfig/SelectModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Select');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: SelectModelTestConfig,
			fields: [
				{name: 'name'},
				{
					name: 'fieldA',
					options: {'editForm': false}
				}
			],
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Select field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Select');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		})
	},
	'Select field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: SelectModelTestConfig,
			fields: [
				{
					name: 'fieldA',
					options: {'editForm': true}
				},
				{
					name: 'fieldB',
					options: {'editForm': true}
				}
			],
		});
	},
	'Select field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'fieldB': {value: 'Two'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
				'fieldB': {value: 'Two'}
			}
		})
	},
};
