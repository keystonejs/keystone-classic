var fieldTests = require('./commonFieldTestUtils.js');
var DateArrayModelTestConfig = require('../../../modelTestConfig/DateArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'DateArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'DateArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'DateArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'DateArray'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'DateArray Field Test 1' }, modelTestConfig: DateArrayModelTestConfig, }, 
		]);
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'DateArray Field Test 1' }, modelTestConfig: DateArrayModelTestConfig, }, 
		]);
		*/

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'DateArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: DateArrayModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: DateArrayModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'DateArray Field Test 1' }, modelTestConfig: DateArrayModelTestConfig, }, 
		]);
		*/

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'addButton', modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { 'dateInputs': ['date1'] }, modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldA', click: 'addButton', modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { 'dateInputs': ['date1', 'date2'] }, modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', click: 'addButton', modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', click: 'addButton', modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldB', options: { 'dateInputs': ['date1', 'date2'] }, modelTestConfig: DateArrayModelTestConfig, }, 
		]);
	},
	'DateArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldA', input: {date1: '2016-01-01', date2: '2016-01-02'}, modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: {date1: '2016-01-03', date2: '2016-01-04'}, modelTestConfig: DateArrayModelTestConfig, }, 
		]);

		// Drop focus on the date field so the popup disappears.
		browser.execute(function() {
			document.activeElement.blur();
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'DateArray Field Test 1' }, modelTestConfig: DateArrayModelTestConfig, }, 
			{ name: 'fieldB', input: { date1: '2016-01-01', date2: '2016-01-02' }, modelTestConfig: DateArrayModelTestConfig, }, 
			{ name: 'fieldB', input: { date1: '2016-01-03', date2: '2016-01-04' }, modelTestConfig: DateArrayModelTestConfig, }, 
		]);
		*/
	},
};
