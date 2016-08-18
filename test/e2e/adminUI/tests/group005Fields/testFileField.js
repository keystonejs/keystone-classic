var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'File field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('File');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'File',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'File field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('File');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'File',
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'File',
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'File',
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		})
	},
	'File field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'File',
			fields: ['fieldA', 'fieldB']
		});
	},
};
