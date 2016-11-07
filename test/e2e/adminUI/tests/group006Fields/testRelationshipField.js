var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/RelationshipModelTestConfig');
var UserModelTestConfig = require('../../../modelTestConfig/UserModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Relationship field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Relationship' });

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
	'Relationship field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Relationship' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
				{ name: 'fieldA', input: { option: 'option1' }, },
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'e2e member' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Relationship field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldB', }
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'e2e member' }, },
			],
		})
	},
	'Relationship field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { option: 'option2' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'e2e member' }, },
				{ name: 'fieldB', input: { value: 'e2e user' }, },
			],
		})
	},
	'Clicking on the relationship navigates to the relavent item': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Relationship' });
		browser.adminUIApp.waitForListScreen();
		browser.adminUIListScreen.clickItemFieldValue({
			fields: [
				{ name: 'fieldA', row: 1, column: 3 }
			],
		});
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', modelTestConfig: UserModelTestConfig }
			],
		});
	}
};
