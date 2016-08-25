var fieldTests = require('./commonFieldTestUtils.js');
var DateModelTestConfig = require('../../../modelTestConfig/DateModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Date');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: DateModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Date field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Date');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.initialFormScreen.assertInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		*/
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		})
		*/
	},
	'Date field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: DateModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Date field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: DateModelTestConfig,
			fields: {
				'fieldB': {value: '2016-01-02'}
			}
		});
		// Drop focus on the date field so the popup disappears.
		browser.execute(function() {
			document.activeElement.blur();
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertInputs({
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
