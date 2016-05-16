var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'LocalFileMultiple field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('LocalFileMultiple');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'LocalFileMultiple',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'LocalFileMultiple field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('LocalFileMultiple');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'LocalFileMultiple',
			fields: {
				'name': {value: 'LocalFileMultiple Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'LocalFileMultiple',
			fields: {
				'name': {value: 'LocalFileMultiple Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'LocalFileMultiple',
			fields: {
				'name': {value: 'LocalFileMultiple Field Test 1'},
			}
		})
	},
	'LocalFileMultiple field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'LocalFileMultiple',
			fields: ['fieldA', 'fieldB']
		});
	},
};
