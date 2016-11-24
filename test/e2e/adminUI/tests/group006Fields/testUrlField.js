var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/UrlModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Url field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Url' });

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
	'Url field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Url' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Url Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'http://www.example1.com' }, },
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Url Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'http://www.example1.com' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Url field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', },
				{ name: 'fieldB', }
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Url Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'http://www.example1.com' }, },
			],
		})
	},
	'Url field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: 'http://www.example2.com' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Url Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'http://www.example1.com' }, },
				{ name: 'fieldB', input: { value: 'http://www.example2.com' }, },
			],
		})
	},
};
