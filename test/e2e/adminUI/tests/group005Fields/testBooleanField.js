var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Boolean field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Boolean');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUIVisible({
			listName: 'Boolean',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'Boolean field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Boolean');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldD': {value: 'Test'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			}
		})
	},
	'Boolean field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUIVisible({
			listName: 'Boolean',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Boolean field should have its default value if hidden': function(browser) {
		// The hidden boolean field fieldC should have its default value true, meaning that fieldD should be visible.
		// This used not to be correct as per issue https://github.com/keystonejs/keystone/issues/3029
		browser.itemPage.assertUIVisible({
			listName: 'Boolean',
			fields: ['fieldD'],
		});
	},
	'Boolean field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Boolean',
			fields: {
				'fieldB': {value: 'false'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldB': {value: 'false'}
			}
		})
	},
};
