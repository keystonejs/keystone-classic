var fieldTests = require('../commonFieldTestUtils');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Boolean field can be created via the initial modal': function (browser) {
		browser.app.openFieldList('Boolean');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			},
		});
		browser.initialFormPage.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
			},
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('New Boolean Boolean Field Test 1 created.');
		browser.itemPage.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldB': {value: 'false'},
			},
		});
	},
	'Boolean field can be edited via the edit form': function (browser) {
		browser.itemPage.fillInputs({
			listName: 'Boolean',
			fields: {
				'fieldB': {value: 'true'}
			},
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved.');
		browser.itemPage.assertInputs({
			listName: 'Boolean',
			fields: {
				'name': {value: 'Boolean Field Test 1'},
				'fieldA': {value: 'true'},
				'fieldB': {value: 'true'},
			}
		});
	},
};
