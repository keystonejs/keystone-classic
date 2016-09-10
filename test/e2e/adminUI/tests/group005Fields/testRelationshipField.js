var fieldTests = require('./commonFieldTestUtils.js');
var RelationshipModelTestConfig = require('../../../modelTestConfig/RelationshipModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Relationship field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Relationship'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: RelationshipModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Relationship field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Relationship'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {option: 'option1'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		})
	},
	'Relationship field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: RelationshipModelTestConfig,
			fields: [{name: 'fieldB'}]
		});
	},
	'Relationship field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'fieldB': {option: 'option2'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
				'fieldB': {value: 'e2e user'}
			}
		})
	},
};
