var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'LocalFilex field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('LocalFilex');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'LocalFilex',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'LocalFilex field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('LocalFilex');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'LocalFilex',
			fields: {
				'name': {value: 'LocalFilex Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'LocalFilex',
			fields: {
				'name': {value: 'LocalFilex Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'LocalFilex',
			fields: {
				'name': {value: 'LocalFilex Field Test 1'},
			}
		})
	},
	'LocalFilex field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'LocalFilex',
			fields: ['fieldA', 'fieldB']
		});
	},
};
