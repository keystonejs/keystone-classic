var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Key field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Key');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Key',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Key field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Key');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
			}
		})
	},
	'Key field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Key',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Key field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Key',
			fields: {
				'fieldB': {value: 'A test key for field B'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
				'fieldB': {value: 'a-test-key-for-field-b'}
			}
		})
	},
};
