var fieldTests = require('./commonFieldTestUtils.js');
var HtmlModelTestConfig = require('../../../modelTestConfig/HtmlModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Html'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: HtmlModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Html field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Html'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		})
	},
	'Html field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: HtmlModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Html field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'fieldB': {value: 'Some test html code for field B'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
				'fieldB': {value: 'Some test html code for field B'}
			}
		})
	},
};
