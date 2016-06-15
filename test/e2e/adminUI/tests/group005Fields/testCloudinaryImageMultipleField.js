var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImageMultiple field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('CloudinaryImageMultiple');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'CloudinaryImageMultiple',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'CloudinaryImageMultiple field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('CloudinaryImageMultiple');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'CloudinaryImageMultiple',
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'CloudinaryImageMultiple',
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'CloudinaryImageMultiple',
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		})
	},
	'CloudinaryImageMultiple field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'CloudinaryImageMultiple',
			fields: ['fieldA', 'fieldB']
		});
	},
};
