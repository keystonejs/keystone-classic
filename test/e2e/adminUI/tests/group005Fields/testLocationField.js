var fieldTests = require('./commonFieldTestUtils.js');
var LocationModelTestConfig = require('../../../modelTestConfig/LocationModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Location'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', options: { showMore: false }, modelTestConfig: LocationModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.clickFieldUI([
			{ name: 'fieldA', click: 'showMore', modelTestConfig: LocationModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', options: { showMore: true }, modelTestConfig: LocationModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Location field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Location'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.clickFieldUI([
			{ name: 'fieldA', click: 'showMore', modelTestConfig: LocationModelTestConfig, }
		]);

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' }, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', input: {
									'number': 'Field A',
									'name': 'Building A',
									'street1': 'Street A',
									'street2': 'Town A',
									'suburb': 'Suburb A',
									'state': 'State A',
									'postcode': 'AAA AAA',
									'country': 'AAA',
									'geoLat': '123',
									'geoLng': '123'
			}, modelTestConfig: LocationModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' }, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', input: {
									'number': 'Field A',
									'name': 'Building A',
									'street1': 'Street A',
									'street2': 'Town A',
									'suburb': 'Suburb A',
									'state': 'State A',
									'postcode': 'AAA AAA',
									'country': 'AAA',
									'geoLat': '123',
									'geoLng': '123'
			}, modelTestConfig: LocationModelTestConfig, }, 
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Location field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', options: { showMore: true }, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldB', options: { showMore: false }, modelTestConfig: LocationModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' }, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', input: {
									'number': 'Field A',
									'name': 'Building A',
									'street1': 'Street A',
									'street2': 'Town A',
									'suburb': 'Suburb A',
									'state': 'State A',
									'postcode': 'AAA AAA',
									'country': 'AAA',
									'geoLat': '123',
									'geoLng': '123'
			}, modelTestConfig: LocationModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', click: 'showMore', modelTestConfig: LocationModelTestConfig, }
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name', modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', options: { showMore: true }, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldB', options: { showMore: true }, modelTestConfig: LocationModelTestConfig, }, 
		]);
	},
	'Location field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' }, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldB', input: {
										'number': 'Field B',
										'name': 'Building B',
										'street1': 'Street B',
										'street2': 'Town B',
										'suburb': 'Suburb B',
										'state': 'State B',
										'postcode': 'BBB BBB',
										'country': 'BBB',
										'geoLat': '123',
										'geoLng': '123'
			}, modelTestConfig: LocationModelTestConfig, }, 
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' }, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldA', input: {
									'number': 'Field A',
									'name': 'Building A',
									'street1': 'Street A',
									'street2': 'Town A',
									'suburb': 'Suburb A',
									'state': 'State A',
									'postcode': 'AAA AAA',
									'country': 'AAA',
									'geoLat': '123',
									'geoLng': '123'
			}, modelTestConfig: LocationModelTestConfig, }, 
			{ name: 'fieldB', input: {
										'number': 'Field B',
										'name': 'Building B',
										'street1': 'Street B',
										'street2': 'Town B',
										'suburb': 'Suburb B',
										'state': 'State B',
										'postcode': 'BBB BBB',
										'country': 'BBB',
										'geoLat': '123',
										'geoLng': '123'
			}, modelTestConfig: LocationModelTestConfig, }, 
		]);
	},
};
