var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Money field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Money');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Money',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Money field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Money');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Money',
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Money',
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Money',
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
			}
		})
	},
	'Money field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Money',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Money field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Money',
			fields: {
				'fieldB': {value: '2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Money',
			fields: {
				'name': {value: 'Money Field Test 1'},
				'fieldA': {value: '1'},
				'fieldB': {value: '2'}
			}
		})
	},
};
