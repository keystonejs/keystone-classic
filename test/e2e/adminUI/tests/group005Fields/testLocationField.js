var fieldTests = require('./commonFieldTestUtils.js');
var LocationModelTestConfig = require('../../../modelTestConfig/LocationModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Location'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{name: 'name'},
				{
					name: 'fieldA',
					options: {showMore: false}
				}
			],
		});

		browser.adminUIInitialFormScreen.clickFieldUI({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldA': {'click': 'showMore'},
			}
		});

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{name: 'name'},
				{
					name: 'fieldA',
					options: {showMore: true}
				}
			],
		});
	},
	'restoring test state': function(browser) {
		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Location field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Location'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.clickFieldUI({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldA': {'click': 'showMore'},
			}
		});
		browser.adminUIInitialFormScreen.fillFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
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
				},
			}
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
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
				},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
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
				},
			}
		})
	},
	'Location field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{
					name: 'fieldA',
					options: {showMore: true}
				},
				{
					name: 'fieldB',
					options: {showMore: false}
				}
			],
		});
		browser.adminUIItemScreen.clickFieldUI({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldB': {'click': 'showMore'},
			}
		});
		browser.adminUIItemScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{
					name: 'fieldA',
					options: {showMore: true}
				},
				{
					name: 'fieldB',
					options: {showMore: true}
				}
			],
		});
	},
	'Location field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldB': {
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
				},
			}
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.adminUIItemScreen.assertFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
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
				},
				'fieldB': {
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
				},
			}
		})
	},
};
