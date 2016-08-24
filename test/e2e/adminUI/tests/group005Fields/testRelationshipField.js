var fieldTests = require('./commonFieldTestUtils.js');
var RelationshipModelTestConfig = require('../../../modelTestConfig/RelationshipModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Relationship field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Relationship');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: RelationshipModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});

		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Relationship field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Relationship');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {option: 'option1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		})
	},
	'Relationship field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: RelationshipModelTestConfig,
			fields: [{name: 'fieldB'}]
		});
	},
	'Relationship field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'fieldB': {option: 'option2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: RelationshipModelTestConfig,
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
				'fieldB': {value: 'e2e user'}
			}
		})
	},
};
