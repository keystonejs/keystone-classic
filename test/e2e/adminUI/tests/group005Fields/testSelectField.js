var fieldTests = require('./commonFieldTestUtils.js');
var SelectModelTestConfig = require('../../../modelTestConfig/SelectModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Select'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
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
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Select field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Select'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		})
	},
	'Select field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
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
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'fieldB': {value: 'Two'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: SelectModelTestConfig,
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
				'fieldB': {value: 'Two'}
			}
		})
	},
};
