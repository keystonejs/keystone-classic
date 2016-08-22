var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Boolean field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Boolean');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			listName: 'Boolean',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Boolean field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Boolean');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldD': {value: 'Test'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		})
	},
	'Boolean field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			listName: 'Boolean',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Boolean field should have its default value if hidden': function(browser) {
		// The hidden boolean field fieldC should have its default value true, meaning that fieldD should be visible.
		// This used not to be correct as per issue https://github.com/keystonejs/keystone/issues/3029
		browser.itemScreen.assertUIVisible({
			listName: 'Boolean',
			fields: ['fieldD'],
		});
	},
	'Boolean field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Boolean',
			fields: {
				'fieldB': {value: 'false'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldB': {value: 'false'}
			}
		})
	},
};
