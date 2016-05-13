var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Text field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Text');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		
		browser.itemPage.assertInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		})
	},
	'Text field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Text',
			fields: {
				'fieldB': {value: 'Some test text for field B'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Text',
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
				'fieldB': {value: 'Some test text for field B'}
			}
		})
	},
};
