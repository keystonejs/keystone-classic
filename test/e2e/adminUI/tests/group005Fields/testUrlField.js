var fieldTests = require('./commonFieldTestUtils.js');
var UrlModelTestConfig = require('../../../modelTestConfig/UrlModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Url field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Url');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: UrlModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Url field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Url');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
			}
		})
	},
	'Url field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: UrlModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Url field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'fieldB': {value: 'http://www.example2.com'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: UrlModelTestConfig,
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'http://www.example1.com'},
				'fieldB': {value: 'http://www.example2.com'}
			}
		})
	},
};
