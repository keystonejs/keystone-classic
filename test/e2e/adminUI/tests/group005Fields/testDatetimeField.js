var fieldTests = require('./commonFieldTestUtils.js');
var DatetimeModelTestConfig = require('../../../modelTestConfig/DatetimeModelTestConfig');

module.exports = {
	'@disabled': true, // TODO:  https://github.com/keystonejs/keystone/issues/3330
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Datetime');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: DatetimeModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Datetime field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Datetime');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: DatetimeModelTestConfig,
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: DatetimeModelTestConfig,
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		});
		*/
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: DatetimeModelTestConfig,
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		})
		*/
	},
	'Datetime field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: DatetimeModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Datetime field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: DatetimeModelTestConfig,
			fields: {
				'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: DatetimeModelTestConfig,
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
				'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
			}
		})
		*/
	},
};
