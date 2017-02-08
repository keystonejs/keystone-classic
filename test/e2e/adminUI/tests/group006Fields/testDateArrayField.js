var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/DateArrayModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'DateArray field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'DateArray' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'DateArray field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'DateArray' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'DateArray Field Test 1' }, },
			],
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
			{ name: 'name', input: { value: 'DateArray Field Test 1' },},
		],
		});
		*/

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'DateArray field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', },
				{ name: 'fieldB', },
			],
		});

		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
			{ name: 'name', input: { value: 'DateArray Field Test 1' },},
		],
		});
		*/

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', click: 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { 'dateInputs': ['date1'] }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', click: 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', options: { 'dateInputs': ['date1', 'date2'] }, },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldB', click: 'addButton', },
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldB', click: 'addButton', },
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldB', options: { 'dateInputs': ['date1', 'date2'] }, },
			],
		});
	},
	'DateArray field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldA', input: { date1: '2016-01-01', date2: '2016-01-02' }, },
			],
		});

		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { date1: '2016-01-03', date2: '2016-01-04' }, },
			],
		});

		// Drop focus on the date field so the popup disappears.
		browser.execute(function () {
			document.activeElement.blur();
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
			{ name: 'name', input: { value: 'DateArray Field Test 1' },},
			{ name: 'fieldB', input: { date1: '2016-01-01', date2: '2016-01-02' },},
			{ name: 'fieldB', input: { date1: '2016-01-03', date2: '2016-01-04' },},
		],
		});
		*/
	},
};
