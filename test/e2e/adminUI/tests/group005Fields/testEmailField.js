var fieldTests = require('./commonFieldTestUtils.js');
var EmailModelTestConfig = require('../../../modelTestConfig/EmailModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Email field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Email'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: EmailModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Email field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Email'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		})
	},
	'Email field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: EmailModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Email field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'fieldB': {value: 'user@example2.com'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
				'fieldB': {value: 'user@example2.com'}
			}
		})
	},
};
