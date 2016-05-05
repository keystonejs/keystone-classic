var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Textarea');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('New Textarea Textarea Field Test 1 created.');
		browser.itemPage.assertInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		})
	},
	'Textarea field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Textarea',
			fields: {
				'fieldB': {value: 'Some test text for field B'}
			}
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved.');
		browser.itemPage.assertInputs({
			listName: 'Textarea',
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
				'fieldB': {value: 'Some test text for field B'}
			}
		})
	},
};
