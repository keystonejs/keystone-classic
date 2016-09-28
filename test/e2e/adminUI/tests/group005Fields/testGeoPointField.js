var fieldTests = require('./commonFieldTestUtils.js');
var GeoPointModelTestConfig = require('../../../modelTestConfig/GeoPointModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'GeoPoint field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'GeoPoint'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: GeoPointModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'GeoPoint field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'GeoPoint'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'GeoPoint Field Test 1' }, modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldA', input: { lat: '123', lng: '456' }, modelTestConfig: GeoPointModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'GeoPoint Field Test 1' }, modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldA', input: { lat: '123', lng: '456' }, modelTestConfig: GeoPointModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'GeoPoint field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldA', modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldB', modelTestConfig: GeoPointModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'GeoPoint Field Test 1' }, modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldA', input: { lat: '123', lng: '456' }, modelTestConfig: GeoPointModelTestConfig, }, 
		]);
	},
	'GeoPoint field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { lat: '789', lng: '246' }, modelTestConfig: GeoPointModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'GeoPoint Field Test 1' }, modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldA', input: { lat: '123', lng: '456' }, modelTestConfig: GeoPointModelTestConfig, }, 
			{ name: 'fieldB', input: { lat: '789', lng: '246' }, modelTestConfig: GeoPointModelTestConfig, }, 
		]);
	},
};
