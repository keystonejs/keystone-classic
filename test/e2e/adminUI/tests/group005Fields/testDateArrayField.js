var fieldTests = require('./commonFieldTestUtils.js');
var DateArrayModelTestConfig = require('../../../modelTestConfig/DateArrayModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'DateArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'DateArray'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: DateArrayModelTestConfig,
			fields: [{name: 'name'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'DateArray field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'DateArray'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'name': {value: 'DateArray Field Test 1'},
			}
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'name': {value: 'DateArray Field Test 1'},
			}
		});
		*/
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'name': {value: 'DateArray Field Test 1'},
			}
		});
		*/
	},
	'DateArray field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: DateArrayModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: DateArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'dateInputs': ['date1']}
			}],
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'fieldA': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: DateArrayModelTestConfig,
			fields: [{
				name: 'fieldA',
				options: {'dateInputs': ['date1', 'date2']}
			}],
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'fieldB': {'click': 'addButton'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: DateArrayModelTestConfig,
			fields: [{
				name: 'fieldB',
				options: {'dateInputs': ['date1', 'date2']}
			}],
		});
	},
	'DateArray field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'fieldA': {date1: '2016-01-01', date2: '2016-01-02'}
			}
		});
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'fieldB': {date1: '2016-01-03', date2: '2016-01-04'}
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
			modelTestConfig: DateArrayModelTestConfig,
			fields: {
				'name': {value: 'DateArray Field Test 1'},
				'fieldA': {date1: '2016-01-01', date2: '2016-01-02'},
				'fieldB': {date1: '2016-01-03', date2: '2016-01-04'},
			}
		});
		*/
	},
};
