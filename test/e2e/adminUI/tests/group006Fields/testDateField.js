var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/DateModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Date field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Date' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', },
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Date field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Date' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Date Field Test 1' }, },
				{ name: 'fieldA', input: { value: '2016-01-01' }, },
			],
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
			{ name: 'name', input: { value: 'Date Field Test 1' },},
			{ name: 'fieldA', input: { value: '2016-01-01' },},
		],
		});
		*/
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Date field should show correctly in the edit form': function (browser) {
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
			{ name: 'name', input: { value: 'Date Field Test 1' },},
			{ name: 'fieldA', input: { value: '2016-01-01' },},
		], 
		});
		*/
	},
	'Date field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: '2016-01-02' }, },
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
			{ name: 'name', input: { value: 'Date Field Test 1' },},
			{ name: 'fieldA', input: { value: '2016-01-01' },},
			{ name: 'fieldB', input: { value: '2016-01-02' },},
		], 
		});
		*/
	},
};
