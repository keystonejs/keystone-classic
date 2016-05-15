var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'LocalFile field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('LocalFile');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'LocalFile',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'LocalFile field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('LocalFile');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'LocalFile',
			fields: {
				'name': {value: 'LocalFile Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'LocalFile',
			fields: {
				'name': {value: 'LocalFile Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'LocalFile',
			fields: {
				'name': {value: 'LocalFile Field Test 1'},
			}
		})
	},
	'LocalFile field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'LocalFile',
			fields: ['fieldA', 'fieldB']
		});
	},
};
