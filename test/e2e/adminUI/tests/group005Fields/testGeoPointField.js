var fieldTests = require('./commonFieldTestUtils.js');
var GeoPointModelTestConfig = require('../../../modelTestConfig/GeoPointModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'GeoPoint field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'GeoPoint'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: GeoPointModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'GeoPoint field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'GeoPoint'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: GeoPointModelTestConfig,
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: GeoPointModelTestConfig,
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: GeoPointModelTestConfig,
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
			}
		})
	},
	'GeoPoint field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: GeoPointModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'GeoPoint field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: GeoPointModelTestConfig,
			fields: {
				'fieldB': {lat: '789', lng: '246'}
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: GeoPointModelTestConfig,
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
				'fieldB': {lat: '789', lng: '246'}
			}
		})
	},
};
