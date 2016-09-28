var fieldTests = require('./commonFieldTestUtils.js');
var RelationshipModelTestConfig = require('../../../modelTestConfig/RelationshipModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Relationship field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Relationship'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: RelationshipModelTestConfig, },
			{ name: 'fieldA', modelTestConfig: RelationshipModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Relationship field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Relationship'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, modelTestConfig: RelationshipModelTestConfig },
			{ name: 'fieldA', input: { option: 'option1' }, modelTestConfig: RelationshipModelTestConfig },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, modelTestConfig: RelationshipModelTestConfig },
			{ name: 'fieldA', input: { value: 'e2e member' }, modelTestConfig: RelationshipModelTestConfig },
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Relationship field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldB', modelTestConfig: RelationshipModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, modelTestConfig: RelationshipModelTestConfig },
			{ name: 'fieldA', input: { value: 'e2e member' }, modelTestConfig: RelationshipModelTestConfig },
		])
	},
	'Relationship field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { option: 'option2' }, modelTestConfig: RelationshipModelTestConfig },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Relationship Field Test 1' }, modelTestConfig: RelationshipModelTestConfig },
			{ name: 'fieldA', input: { value: 'e2e member' }, modelTestConfig: RelationshipModelTestConfig },
			{ name: 'fieldB', input: { value: 'e2e user' }, modelTestConfig: RelationshipModelTestConfig },
		])
	},
};
