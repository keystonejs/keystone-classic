var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/LocationModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Location'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA', options: { showMore: false },},
		]);

		browser.adminUIInitialFormScreen.clickFieldUI([
			{ name: 'fieldA', click: 'showMore',}
		]);

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA', options: { showMore: true },},
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Location field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Location'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.clickFieldUI([
			{ name: 'fieldA', click: 'showMore',}
		]);

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' },},
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
			},},
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' },},
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
			},},
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Location field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA', options: { showMore: true },},
			{ name: 'fieldB', options: { showMore: false },},
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' },},
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
			},},
		]);

		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', click: 'showMore',}
		]);

		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA', options: { showMore: true },},
			{ name: 'fieldB', options: { showMore: true },},
		]);
	},
	'Location field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' },},
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
			},},
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals('flashMessage', 'Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Location Field Test 1' },},
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
			},},
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
			},},
		]);
	},
};
