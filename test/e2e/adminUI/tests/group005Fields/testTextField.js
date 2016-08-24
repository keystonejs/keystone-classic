var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Text field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Text');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Text',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Text field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Text');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		})
	},
	'Text field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Text',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Text field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Text',
			fields: {
				'fieldB': {value: 'Some test text for field B'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
				'fieldB': {value: 'Some test text for field B'}
			}
		})
	},
};
