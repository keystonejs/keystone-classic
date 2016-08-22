var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImageMultiple field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('CloudinaryImageMultiple');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'CloudinaryImageMultiple',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'CloudinaryImageMultiple field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('CloudinaryImageMultiple');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'CloudinaryImageMultiple',
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'CloudinaryImageMultiple',
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'CloudinaryImageMultiple',
			fields: {
				'name': {value: 'CloudinaryImageMultiple Field Test 1'},
			}
		})
	},
	'CloudinaryImageMultiple field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'CloudinaryImageMultiple',
			fields: ['fieldA', 'fieldB']
		});
	},
};
