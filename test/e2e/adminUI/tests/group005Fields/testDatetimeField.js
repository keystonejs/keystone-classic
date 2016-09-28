var fieldTests = require('./commonFieldTestUtils.js');
var DatetimeModelTestConfig = require('../../../modelTestConfig/DatetimeModelTestConfig');

module.exports = {
	//'@disabled': true, // TODO:  https://github.com/keystonejs/keystone/issues/3330
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Datetime'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: DatetimeModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: DatetimeModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Datetime field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Datetime'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Datetime Field Test 1' }, modelTestConfig: DatetimeModelTestConfig, }, 
			/* https://github.com/keystonejs/keystone/issues/3330
			{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' }, modelTestConfig: DatetimeModelTestConfig, },
			*/ 
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Datetime Field Test 1' }, modelTestConfig: DatetimeModelTestConfig, }, 
			/* https://github.com/keystonejs/keystone/issues/3330
			{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' }, modelTestConfig: DatetimeModelTestConfig, }, 
			*/
		]);
	
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Datetime field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: DatetimeModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: DatetimeModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: DatetimeModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Datetime Field Test 1' }, modelTestConfig: DatetimeModelTestConfig, }, 
			/* https://github.com/keystonejs/keystone/issues/3330
			{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' }, modelTestConfig: DatetimeModelTestConfig, }, 
			*/
		]);
	},
	'Datetime field can be filled via the edit form': function(browser) {
		/* https://github.com/keystonejs/keystone/issues/3330
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { date: '2016-01-02', time: '12:00:00 am' }, modelTestConfig: DatetimeModelTestConfig, }, 
		]);
		*/

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Datetime Field Test 1' }, modelTestConfig: DatetimeModelTestConfig, }, 
			/* https://github.com/keystonejs/keystone/issues/3330
			{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' }, modelTestConfig: DatetimeModelTestConfig, }, 
			{ name: 'fieldB', input: { date: '2016-01-02', time: '12:00:00 am' }, modelTestConfig: DatetimeModelTestConfig, }, 
			*/
		]);
	},
};
