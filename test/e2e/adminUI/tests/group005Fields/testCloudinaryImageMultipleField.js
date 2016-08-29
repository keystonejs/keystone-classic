var fieldTests = require('./commonFieldTestUtils.js');
var CloudinaryImageMultipleModelTestConfig = require('../../../modelTestConfig/CloudinaryImageMultipleModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImageMultiple field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('CloudinaryImageMultiple');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: CloudinaryImageMultipleModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'CloudinaryImageMultiple field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('CloudinaryImageMultiple');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: CloudinaryImageMultipleModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: CloudinaryImageMultipleModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: CloudinaryImageMultipleModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		})
	},
	'CloudinaryImageMultiple field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: CloudinaryImageMultipleModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
};
