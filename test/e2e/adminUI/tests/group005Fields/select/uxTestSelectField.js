var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Select');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Select',
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Select',
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('New Select Select Field Test 1 created.');
		browser.itemPage.assertInputs({
			listName: 'Select',
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
			}
		})
	},
	/* Pending select's assertInput actually checking the given field
	'Select field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Select',
			fields: {
				'fieldB': {value: 'Two'}
			}
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved.');
		browser.itemPage.assertInputs({
			listName: 'Select',
			fields: {
				'name': {value: 'Select Field Test 1'},
				'fieldA': {value: 'One'},
				'fieldB': {value: 'Two'}
			}
		})
	},
	*/
};
