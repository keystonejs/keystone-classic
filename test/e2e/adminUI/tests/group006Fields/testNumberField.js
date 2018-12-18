var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/NumberModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Number field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Number' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', }
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Number field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Number' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Number Field Test 1' }, },
				{ name: 'fieldA', input: { value: '1' }, },
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Number Field Test 1' }, },
				{ name: 'fieldA', input: { value: '1' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Number field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', },
				{ name: 'fieldB', }
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Number Field Test 1' }, },
				{ name: 'fieldA', input: { value: '1' }, },
			],
		})
	},
	'Number field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: '2' }, },
			],
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Number Field Test 1' }, },
				{ name: 'fieldA', input: { value: '1' }, },
				{ name: 'fieldB', input: { value: '2' }, },
			],
		})
	},
	'Number field should save negative values': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: '-5' }, },
			],
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Number Field Test 1' }, },
				{ name: 'fieldA', input: { value: '1' }, },
				{ name: 'fieldB', input: { value: '-5' }, },
			],
		});
	},
	'Number field should save decimal values': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: '4.5' }, },
			],
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Number Field Test 1' }, },
				{ name: 'fieldA', input: { value: '1' }, },
				{ name: 'fieldB', input: { value: '4.5' }, },
			],
		});
	}
};
