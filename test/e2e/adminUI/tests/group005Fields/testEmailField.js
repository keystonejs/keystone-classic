var fieldTests = require('./commonFieldTestUtils.js');
var EmailModelTestConfig = require('../../../modelTestConfig/EmailModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Email field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Email');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: EmailModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Email field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Email');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		})
	},
	'Email field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: EmailModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Email field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'fieldB': {value: 'user@example2.com'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: EmailModelTestConfig,
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
				'fieldB': {value: 'user@example2.com'}
			}
		})
	},
};
