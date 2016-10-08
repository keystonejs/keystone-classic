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
		browser.adminUIApp.openList({section: 'fields', list: 'Relationship'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA',}
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Relationship field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Relationship'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
			{ name: 'fieldA', input: { option: 'option1' }, },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
			{ name: 'fieldA', input: { value: 'e2e member' }, },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Relationship field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldB',}
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
			{ name: 'fieldA', input: { value: 'e2e member' }, },
		])
	},
	'Relationship field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { option: 'option2' }, },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals('flashMessage', 'Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, },
			{ name: 'fieldA', input: { value: 'e2e member' }, },
			{ name: 'fieldB', input: { value: 'e2e user' }, },
		])
	},
	'Clicking on the relationship navigates to the relavent item': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Relationship'});
		browser.adminUIApp.waitForListScreen();
		browser.adminUIListScreen.clickItemFieldValue([
			{ name: 'fieldA', row: 1, column: 3 }
		]);
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: UserModelTestConfig }
		]);
	}
};
