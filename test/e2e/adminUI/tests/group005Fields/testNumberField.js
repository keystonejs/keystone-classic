var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Number field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Number');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Number',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Number field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Number');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Number',
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Number',
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Number',
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
			}
		})
	},
	'Number field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Number',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Number field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Number',
			fields: {
				'fieldB': {value: '2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Number',
			fields: {
				'name': {value: 'Number Field Test 1'},
				'fieldA': {value: '1'},
				'fieldB': {value: '2'}
			}
		})
	},
};
