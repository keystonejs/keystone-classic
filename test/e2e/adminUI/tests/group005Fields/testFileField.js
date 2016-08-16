var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'File field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('File');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'File',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'File field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('File');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'File',
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'File',
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'File',
			fields: {
				'name': {value: 'File Field Test 1'},
			}
		})
	},
	'File field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'File',
			fields: ['fieldA', 'fieldB']
		});
	},
};
