var fieldTests = require('./commonFieldTestUtils.js');
var RelationshipModelTestConfig = require('../../../modelTestConfig/RelationshipModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Relationship field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Relationship');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: RelationshipModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});

		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Relationship field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Relationship');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {option: 'option1'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		})
	},
	'Relationship field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: RelationshipModelTestConfig,
			fields: [{name: 'fieldB'}]
		});
	},
	'Relationship field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'fieldB': {option: 'option2'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
				'fieldB': {value: 'e2e user'}
			}
		})
	},
};
