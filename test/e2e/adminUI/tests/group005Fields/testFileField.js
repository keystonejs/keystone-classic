var fieldTests = require('./commonFieldTestUtils.js');
var FileModelTestConfig = require('../../../modelTestConfig/FileModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'File field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('File');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: FileModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'File field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('File');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: FileModelTestConfig,
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: FileModelTestConfig,
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: FileModelTestConfig,
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		})
	},
	'File field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: FileModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
};
