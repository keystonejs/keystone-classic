var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Color field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Color');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Color',
			fields: {
				'name': {value: 'Color Field Test 1'},
				'fieldA': {value: '#002147'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Color',
			fields: {
				'name': {value: 'Color Field Test 1'},
				'fieldA': {value: '#002147'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Color',
			fields: {
				'name': {value: 'Color Field Test 1'},
				'fieldA': {value: '#002147'},
			}
		})
	},
	'Color field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Color',
			fields: {
				'fieldB': {value: '#f8e71c'}
			}
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Color',
			fields: {
				'name': {value: 'Color Field Test 1'},
				'fieldA': {value: '#002147'},
				'fieldB': {value: '#f8e71c'}
			}
		})
	},
};
