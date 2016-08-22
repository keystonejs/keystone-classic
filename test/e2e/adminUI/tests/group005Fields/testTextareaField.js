var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Textarea');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Textarea',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Textarea field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Textarea');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		})
	},
	'Textarea field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Textarea',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Textarea field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Textarea',
			fields: {
				'fieldB': {value: 'Some test text for field B'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
				'fieldB': {value: 'Some test text for field B'}
			}
		})
	},
};
