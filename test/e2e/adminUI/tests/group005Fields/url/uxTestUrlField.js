var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Url field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Url');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Url',
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'www.example1.com'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Url',
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'www.example1.com'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		
		browser.itemPage.assertInputs({
			listName: 'Url',
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'www.example1.com'},
			}
		})
	},
	'Url field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Url',
			fields: {
				'fieldB': {value: 'www.example2.com'}
			}
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Url',
			fields: {
				'name': {value: 'Url Field Test 1'},
				'fieldA': {value: 'www.example1.com'},
				'fieldB': {value: 'www.example2.com'}
			}
		})
	},
};
