var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImage field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('CloudinaryImage');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'CloudinaryImage',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'CloudinaryImage field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('CloudinaryImage');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'CloudinaryImage',
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'CloudinaryImage',
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'CloudinaryImage',
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		})
	},
	'CloudinaryImage field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'CloudinaryImage',
			fields: ['fieldA', 'fieldB']
		});
	},
};
