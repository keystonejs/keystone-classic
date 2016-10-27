var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/DatetimeModelTestConfig');

module.exports = {
	//'@disabled': true, // TODO:  https://github.com/keystonejs/keystone/issues/3330
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Datetime field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Datetime' });

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
	'Datetime field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Datetime' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Datetime Field Test 1' }, },
				/* https://github.com/keystonejs/keystone/issues/3330
				{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' },},
				*/
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Datetime Field Test 1' }, },
				/* https://github.com/keystonejs/keystone/issues/3330
				{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' },},
				*/
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Datetime field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', },
				{ name: 'fieldB', },
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Datetime Field Test 1' }, },
				/* https://github.com/keystonejs/keystone/issues/3330
				{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' },},
				*/
			],
		});
	},
	'Datetime field can be filled via the edit form': function (browser) {
		/* https://github.com/keystonejs/keystone/issues/3330
		browser.adminUIItemScreen.fillFieldInputs({ 
			fields: [
			{ name: 'fieldB', input: { date: '2016-01-02', time: '12:00:00 am' },},
		], 
	});
		*/

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Datetime Field Test 1' }, },
				/* https://github.com/keystonejs/keystone/issues/3330
				{ name: 'fieldA', input: { date: '2016-01-01', time: '12:00:00 am' },},
				{ name: 'fieldB', input: { date: '2016-01-02', time: '12:00:00 am' },},
				*/
			],
		});
	},
};
