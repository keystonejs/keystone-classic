var fieldTests = require('./commonFieldTestUtils.js');
var TextareaModelTestConfig = require('../../../modelTestConfig/TextareaModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Textarea'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: TextareaModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Textarea field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Textarea'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Textarea field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: TextareaModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		})
	},
	'Textarea field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'fieldB': {value: 'Some test text for field B'}
			}
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: TextareaModelTestConfig,
			fields: {
				'name': {value: 'Textarea Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
				'fieldB': {value: 'Some test text for field B'}
			}
		})
	},
};
