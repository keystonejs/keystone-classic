var fieldTests = require('./commonFieldTestUtils.js');
var CloudinaryImageModelTestConfig = require('../../../modelTestConfig/CloudinaryImageModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImage field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('CloudinaryImage');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'CloudinaryImage field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('CloudinaryImage');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		})
	},
	'CloudinaryImage field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: CloudinaryImageModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
};
