var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Name');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Name',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Name field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Name');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		})
	},
	'Name field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Name',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Name field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Name',
			fields: {
				'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
				'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
			}
		})
	},
};
