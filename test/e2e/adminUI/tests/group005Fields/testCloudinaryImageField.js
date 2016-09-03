var fieldTests = require('./commonFieldTestUtils.js');
var CloudinaryImageModelTestConfig = require('../../../modelTestConfig/CloudinaryImageModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImage field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'CloudinaryImage'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'CloudinaryImage field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'CloudinaryImage'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		})
	},
	'CloudinaryImage field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
};
