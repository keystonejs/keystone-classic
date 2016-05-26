var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Relationship field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Relationship');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Relationship',
			fields: ['name', 'fieldA']
		});

		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'Relationship field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Relationship');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Relationship',
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {option: 'option1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Relationship',
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Relationship',
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
			}
		})
	},
	'Relationship field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'Relationship',
			fields: ['fieldB']
		});
	},
	'Relationship field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Relationship',
			fields: {
				'fieldB': {option: 'option2'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Relationship',
			fields: {
				'name': {value: 'Relationship Field Test 1'},
				'fieldA': {value: 'e2e member'},
				'fieldB': {value: 'e2e user'}
			}
		})
	},
};
