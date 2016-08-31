var fieldTests = require('./commonFieldTestUtils.js');
var UrlModelTestConfig = require('../../../modelTestConfig/UrlModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Url field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Url'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: UrlModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Url field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Url'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
			}
		})
	},
	'Url field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: UrlModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Url field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'fieldB': {value: 'http://www.example2.com'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
				'fieldB': {value: 'http://www.example2.com'}
			}
		})
	},
};
