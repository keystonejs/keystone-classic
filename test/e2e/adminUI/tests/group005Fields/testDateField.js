var fieldTests = require('./commonFieldTestUtils.js');
var DateModelTestConfig = require('../../../modelTestConfig/DateModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Date'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: DateModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Date field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Date'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		*/
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		})
		*/
	},
	'Date field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: DateModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Date field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'fieldB': {value: '2016-01-02'}
			}
		});
		// Drop focus on the date field so the popup disappears.
		browser.execute(function() {
			document.activeElement.blur();
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
				'fieldB': {value: '2016-01-02'}
			}
		})
		*/
	},
};
