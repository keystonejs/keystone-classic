var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Email field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Email');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Email',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Email field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Email');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Email',
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Email',
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Email',
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
			}
		})
	},
	'Email field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Email',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Email field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Email',
			fields: {
				'fieldB': {value: 'user@example2.com'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Email',
			fields: {
				'name': {value: 'Email Field Test 1'},
				'fieldA': {value: 'user@example1.com'},
				'fieldB': {value: 'user@example2.com'}
			}
		})
	},
};
