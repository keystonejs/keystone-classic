var fieldTests = require('./commonFieldTestUtils.js');
var TextareaModelTestConfig = require('../../../modelTestConfig/TextareaModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Textarea');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			modelTestConfig: TextareaModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Textarea field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Textarea');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.assertInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		})
	},
	'Textarea field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUIVisible({
			modelTestConfig: TextareaModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Textarea field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'fieldB': {value: 'Some test text for field B'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
				'fieldB': {value: 'Some test text for field B'}
			}
		})
	},
};
