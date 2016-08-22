var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Code field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Code');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Code',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Code field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Code');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		})
	},
	'Code field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Code',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Code field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Code',
			fields: {
				'fieldB': {value: 'Some test code for field B'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
				'fieldB': {value: 'Some test code for field B'}
			}
		})
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
};
