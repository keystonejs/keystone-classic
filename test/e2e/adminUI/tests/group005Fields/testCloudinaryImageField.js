var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImage field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('CloudinaryImage');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'CloudinaryImage',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'CloudinaryImage field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('CloudinaryImage');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'CloudinaryImage',
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'CloudinaryImage',
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'CloudinaryImage',
			fields: {
				'name': {value: 'CloudinaryImage Field Test 1'},
			}
		})
	},
	'CloudinaryImage field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'CloudinaryImage',
			fields: ['fieldA', 'fieldB']
		});
	},
};
